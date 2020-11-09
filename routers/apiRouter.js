const express = require('express');
const fetch = require('node-fetch');
const locations = require('../data/locations');
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
  api.get('/v1/locations', (req, res, next) => res.send(locations));


  api.get(
    '/v1/forecast',
    // TODO -> extract this into it's own interface so it can easily be swapped with another server if needed
    (req, res, next) => {
      if (req.query.lat && req.query.lng) {
        
        // Cast the lat and lng into numbers for decimal truncation
        let { lat, lng } = req.query;
        try {
          lat = parseFloat(lat).toFixed(5);
          lng = parseFloat(lng).toFixed(5);
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

        // First check the cache for the "points" data
        const cachedPoints = weatherCache.get(url);
        if (cachedPoints) {
          fetchForecasts(res, cachedPoints, url);
        }

        // Points NOT cached, fetch the data
        else {
          fetch(url, {
            method  : 'GET', 
            headers : headers,
          })
          .then(response => response.json())
          .then(data => fetchForecasts(res, data, url))
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


function fetchForecasts(res, data, cacheKey) {
  if (data && data.properties && data.properties.forecast && data.properties.forecastGridData) {
    const forecastCacheKey = cacheKey+'/forecast';
    const cachedForecast = weatherCache.get(forecastCacheKey);
    
    // Forecast cached
    if (cachedForecast) {
      res.status(200).send(cachedForecast);
    }

    // Forecast NOT cached
    else {

      Promise.all([
        fetch(data.properties.forecast),
        fetch(data.properties.forecastGridData)
      ])
      .then(result => Promise.all(result.map(r => r.json())))
      .then(([forecast, forecastGridData]) => {
        if (forecast && forecast.properties && forecastGridData && forecastGridData.properties) {
          const data = {forecast: forecast.properties, forecastGridData: forecastGridData.properties};
          res.status(200).send(data);
          weatherCache.set(forecastCacheKey, data); // Store forecast in local cache
        }
        else {
          res.status(500).send({error: 'Unable to fetch forecast'});
          logger.log({
            level: 'error',
            message: "Bad forecast received.\n" + JSON.stringify(forecast) + "\n" + JSON.stringify(forecastGridData)
          });
        }
      });
    }

    // Store the "points" data in cache for a week
    weatherCache.set(cacheKey, data, 60 * 60 * 24 * 7);
  }
  else {
    res.status(500).send({error: 'Unable to reach forecast service'});
    logger.log({
      level: 'error',
      message: "Bad points data.\n" + JSON.stringify(data)
    });
  }
}
