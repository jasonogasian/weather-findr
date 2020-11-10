import { useEffect, useState } from "react";
import { fetchForecast } from "lib/fetch";
import { library } from "@fortawesome/fontawesome-svg-core";
import { celcius2Farenheight, km2Mi, meters2Feet } from "lib/conversions";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import Spinner from "components/Spinner/Spinner";
// import { Chart } from 'react-charts'

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


  const renderSimpleFrecast = () => {
    const periods = forecast && forecast.periods ? forecast.periods.slice(0, 3) : {};
    return periods.map(period => (
      <div key={ period.number } className="forecast">
        <h4>{ period.name }'s Forecast</h4>
        <div className="simple">
          <div className="weather-icon">
            <img alt={ period.shortForecast } className="weather-icon" src={ period.icon } />
          </div>
          <div className="simple-forecast">
            { period.detailedForecast }
          </div>
        </div>
      </div>
    ));
  }


  const renderCurrentConditions = (index=0) => {
    const currTemp = extractNumericData(currentWeather.temperature, index, celcius2Farenheight);
    const maxTemp = extractNumericData(currentWeather.maxTemperature, index, celcius2Farenheight);
    const minTemp = extractNumericData(currentWeather.minTemperature, index, celcius2Farenheight);
    const snowLevel = extractNumericData(currentWeather.snowLevel, index, meters2Feet);
    const windChill = extractNumericData(currentWeather.windChill, index, celcius2Farenheight);
    const wind = extractNumericData(currentWeather.windSpeed, index, km2Mi);
    const gusts = extractNumericData(currentWeather.windGust, index, km2Mi);
    const skyCover = extractNumericData(currentWeather.skyCover, index, km2Mi);
    // console.log('Current', currentWeather);
    
    const currentOnly = index === 0;
    return (
      <div key={index} className="current-conditions">
        
        { currentOnly && 
          <h4>Current Conditions</h4>
        }

        <div className="temps inline">
          { currentOnly && 
            <div className="current-temp">{ currTemp }&deg;F</div>
          }

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

          { currentOnly && 
            <div>
              <label>Wind Chill</label>
              <div>{ windChill }&deg;F</div>
            </div>
          }
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
    );
  }


  if (loading || (!loading && !forecast)) {
    return <Spinner />;
  }

  return (
    <div className="WeatherDotGov">
      { renderCurrentConditions() }
      { props.simple && renderSimpleFrecast() }
    </div>
  )
}


function getForecast(lat, lng, retrying=false) {
  return new Promise((resolve, reject) => {
    fetchForecast(lat, lng)
    .then(data => {
      if (data && data.forecast && data.forecast.periods && data.forecastGridData) {
        resolve(data);
      }
      else {
        if (!retrying) {
          // Retry once, weather.gov periodically fails with a 404 for the URL it provides...
          // Maybe move this logic to the server?
          getForecast(lat,lng, true).then(resolve).catch(reject);
        }
        else {
          alert('Sorry, there was a problem getting your forecast. Please try again later');
        }
      }
    })
    .catch((err) => {
      console.error('Error getting forecast', err);
      alert('Ooops, there was a problem loading your forecast. Please try again later.');
    });
  });
}


function extractNumericData(dataPoint, index, conversion) {
  let data = '--';
  try {
    if (conversion) {
      data = Math.round(conversion(dataPoint.values[index].value));
    }
    else {
      data = Math.round(dataPoint.values[index].value);
    }
  } catch(err) {
    data = 'Error';
  }
  return data
}


export default WeatherDotGov;