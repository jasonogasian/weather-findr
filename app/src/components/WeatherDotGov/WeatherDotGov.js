import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import Spinner from "components/Spinner/Spinner";

import './WeatherDotGov.scss';


// Icons
library.add(faLocationArrow);


function WeatherDotGov(props) {
  const [ loading, setLoading ] = useState(false);
  const [ forecast, setForecast ] = useState(null);
  const [ currentWeather, setCurrentWeather ] = useState(null);


  useEffect(() => {
    if (props.lat && props.lng) {
      setLoading(true);
      getForecast(props.lat, props.lng)
      .then(data => {
        setForecast(data.forecast);
        setCurrentWeather(data.forecastGridData);
        if (data.forecastGridData.elevation) {
          props.onElevation(data.forecastGridData.elevation);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [props.lat, props.lng]);


  if (loading || (!loading && !forecast)) {
    return <Spinner />;
  }

 
  const periods = forecast && forecast.periods ? forecast.periods.slice(0, 3) : {};
  console.log('Current', currentWeather);
  return (
    <div className="WeatherDotGov">

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
    const url = `/api/v1/forecast?lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}`;
    const headers = new Headers({
      "Accept": "application/geo+json",
      "User-Agent": "(tahoe-bc-ski-forecast.com, jason@ogasian.com)"
    });
    fetch(url, {
      method  : 'GET', 
      headers : headers,
    })
    .then(response => response.json())
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