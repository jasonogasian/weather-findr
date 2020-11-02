import { useEffect, useState } from "react";
import { geolocated } from "react-geolocated";

import './LocalWeather.scss';


const KEY = 'WQ0S7HvMWzBP1j91kqF81Ypf80AGX7Dx';

function LocalWeather(props) {
  const [ search, setSearch ] = useState('');
  const [ addressResults, setAddressResults ] = useState([]);

  useEffect(() => {
    if (search.length >= 3) {
      predict(search)
      .then(results => {
        setAddressResults(results.results);  
      });
    }
    else if (!search) {
      setAddressResults([]);
    }
  }, [search])
  

  return (
    <div className="LocalWeather">
      {
        !props.isGeolocationAvailable ? (
            <div>Your browser does not support Geolocation</div>
        ) : !props.isGeolocationEnabled ? (
            <div>Geolocation is not enabled</div>
        ) : props.coords ? (
            <table>
              <tbody>
                <tr>
                  <td>latitude</td>
                  <td>{props.coords.latitude}</td>
                </tr>
                <tr>
                  <td>longitude</td>
                  <td>{props.coords.longitude}</td>
                </tr>
              </tbody>
            </table>
        ) : (
            <div>Getting the location data&hellip; </div>
        )
      }

      <div className="address-form">
        <input 
          name="address"
          value={ search }
          onChange={ e => setSearch(e.target.value) } />
        <button onClick={ () => predict(search) }>GO</button>

        {
          addressResults.map(r => (
          <div key={r.id} className="result">{r.displayString}</div>
          ))
        }
      </div>
    </div>
  )
}


function predict(search) {
  return new Promise((resolve, reject) => {
    if (!search) {
      return resolve([]);
    }

    const url = `http://www.mapquestapi.com/search/v3/prediction?key=${KEY}&limit=5&collection=poi,address&q=${search}`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
      resolve(data);
      console.log('Search', data);
    });
  });
}


export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocalWeather);