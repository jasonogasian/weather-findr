import { useEffect, useState } from "react";
import { fetchForecast } from "lib/fetch";
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