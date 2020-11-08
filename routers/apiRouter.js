const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require( "node-cache" );


//
// Set up an in-memory cache for weather responses.
// Reduces the number of calls to the weather API
// (~400ms down to ~15ms locally)
//
const weatherCache = new NodeCache({
  stdTTL: 3600,      // 1 hour TTL
  checkperiod: 3700, // Periodic delete check
  useClones: false,  // Better perfomance, just pass by reference
});


const apiRouter = (logger) => {

  const api = express.Router();


  //
  // V1
  //
  api.get(
    '/v1/forecast',
    // TODO -> extract this into it's own interface so it can easily be swapped with another server if needed
    (req, res, next) => {
      if (req.query.lat && req.query.lng) {
        
        // Cast the lat and lng into numbers for decimal truncation
        let { lat, lng } = req.query;
        try {
          lat = parseFloat(lat).toFixed(4);
          lng = parseFloat(lng).toFixed(4);
        } catch(err) {
          res.status(400).send({error: 'Invalid parameters. lat/lng must be valid numbers.'});
          logger.log({
            level: 'error',
            message: "Invalid lat/lng received.\n" + err.message
          });
          return;
        }

        // Call weather.gov to get the forecast for the given lat/lng
        const url = `https://api.weather.gov/points/${lat},${lng}`;
        const headers = {
          "Accept": "application/geo+json",
          "User-Agent": "(tahoe-bc-ski-forecast.com, jason@ogasian.com)"
        };

        // First check the cache
        const cached = weatherCache.get(url);
        if (cached) {
          res.status(200).send(cached);
        }

        // Not cached, fetch the data
        else {
          fetch(url, {
            method  : 'GET', 
            headers : headers,
          })
          .then(response => response.json())
          .then(data => {
            if (data && data.properties && data.properties.forecast && data.properties.forecastGridData) {
              Promise.all([
                fetch(data.properties.forecast),
                fetch(data.properties.forecastGridData)
              ])
              .then(result => Promise.all(result.map(r => r.json())))
              .then(([forecast, forecastGridData]) => {
                if (forecast && forecast.properties && forecastGridData && forecastGridData.properties) {
                  const data = {forecast: forecast.properties, forecastGridData: forecastGridData.properties};
                  res.status(200).send(data);
                  weatherCache.set(url, data); // Store in local cache
                }
                else {
                  res.status(500).send({error: 'Unable to fetch forecast'});
                }
              });
            }
            else {
              res.status(500).send({error: 'Unable to reach forecast service'});
            }
          })
          .catch(err => {
            res.status(500).send({error: 'There was an error making the request.'});
            logger.log({
              level: 'error',
              message: JSON.stringify(err),
            });
          });
        }
      }

      else {
        res.status(400).send({error: "Missing parameter. 'lat' and 'lng' are required"});
      }
    }
  );

  return api;
}
module.exports = apiRouter;
