const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const config = require('../config');



const apiRouter = (logger) => {

  const api = express.Router();


  //
  // V1
  //
  api.get(
    '/v1/forecast',
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
        fetch(url, {
          method  : 'GET', 
          headers : headers,
        })
        .then(response => response.json())
        .then(data => {
          if (data && data.properties && data.properties.forecast) {
            fetch(data.properties.forecast)
            .then(response => response.json())
            .then(data => {
              if (data && data.properties) {
                res.status(200).send(data.properties);
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

      else {
        res.status(400).send({error: "Missing parameter. 'lat' and 'lng' are required"});
      }
    }
  );

  return api;
}
module.exports = apiRouter;
