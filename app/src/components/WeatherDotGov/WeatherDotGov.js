import { useEffect, useState } from "react";
import { fetchForecast } from "lib/fetch";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import Spinner from "components/Spinner/Spinner";

import './WeatherDotGov.scss';
import { celcius2Farenheight, km2Mi, meters2Feet } from "lib/conversions";


// Icons
library.add(faLocationArrow);


function WeatherDotGov(props) {
  const [ loading, setLoading ] = useState(false);
  const [ forecast, setForecast ] = useState(null);
  const [ currentWeather, setCurrentWeather ] = useState(null);
  const { lat, lng, onElevation } = props;


  useEffect(() => {
    if (lat && lng) {
      setLoading(true);
      getForecast(lat, lng)
      .then(data => {
        setForecast(data.forecast);
        setCurrentWeather(data.forecastGridData);

        if (data.forecastGridData.elevation) {
          onElevation(data.forecastGridData.elevation);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [lat, lng, onElevation]);


  if (loading || (!loading && !forecast)) {
    return <Spinner />;
  }

 
  const periods = forecast && forecast.periods ? forecast.periods.slice(0, 3) : {};
  let currTemp = '--';
  let maxTemp = '--';
  let minTemp = '--';
  let snowLevel = '--';
  let windChill = '--';
  let wind = '--';
  let gusts = '--';
  let skyCover = '--';
  try {
    currTemp = Math.round(celcius2Farenheight(currentWeather.temperature.values[0].value));
    maxTemp = Math.round(celcius2Farenheight(currentWeather.maxTemperature.values[0].value));
    minTemp = Math.round(celcius2Farenheight(currentWeather.minTemperature.values[0].value));
    snowLevel = Math.round(meters2Feet(currentWeather.snowLevel.values[0].value));
    windChill = Math.round(celcius2Farenheight(currentWeather.windChill.values[0].value));
    wind = Math.round(km2Mi(currentWeather.windSpeed.values[0].value));
    gusts = Math.round(km2Mi(currentWeather.windGust.values[0].value));
    skyCover = Math.round(km2Mi(currentWeather.skyCover.values[0].value));
  } catch(err) {
    currTemp = 'Error';
    maxTemp = 'Error';
    minTemp = 'Error';
    snowLevel = 'Error';
    windChill = 'Error';
    wind = 'Error';
    gusts = 'Error';
    skyCover = 'Error';
  }
  console.log('Current', currentWeather);
  return (
    <div className="WeatherDotGov">

      <div className="current-conditions">
        <h4>Current Conditions</h4>

        <div className="temps inline">
          <div className="current-temp">{ currTemp }&deg;F</div>

          <div>
            <div className="inline">
              <label>High</label>
              <div>{ maxTemp }&deg;F</div>
            </div>
            <div className="inline">
              <label>Low</label>
              <div>{ minTemp }&deg;F</div>
            </div>
          </div>

          <div>
            <label>Wind Chill</label>
            <div>{ windChill }&deg;F</div>
          </div>
        </div>

        <div className="inline">
          <div>
            <label>Snow Level</label>
            <div>{ snowLevel }ft</div>
          </div>

          <div>
            <div className="inline">
              <label>Wind</label>
              <div>{ wind }mph</div>
            </div>
            <div className="inline">
              <label>Gusts</label>
              <div>{ gusts }mph</div>
            </div>
          </div>

          <div>
            <label>Cloud Cover</label>
            <div>{ skyCover }%</div>
          </div>
        </div>

        
      </div>

      { periods.map(period => (
        <div key={ period.number } className="forecast">
          <h4>{ period.name }'s Forecast</h4>
          <div className="detailed">
            <div className="weather-icon">
              <img alt={ period.shortForecast } className="weather-icon" src={ period.icon } />
            </div>
            <div className="detailed-forecast">
              { period.detailedForecast }
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


function getForecast(lat, lng) {
  return new Promise((resolve, reject) => {
    fetchForecast(lat, lng)
    .then(data => {
      if (data && data.forecast && data.forecast.periods && data.forecastGridData) {
        resolve(data);
      }
      else {
        alert('Sorry, there was a problem getting your forecast. Please try again later');
      }
    })
    .catch((err) => {
      console.error('Error getting forecast', err);
      alert('Ooops, there was a problem loading your forecast. Please try again later.');
    });
  });
}


export default WeatherDotGov;