import { useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";

import './LocalWeather.scss';
import WeatherDotGov from "components/WeatherDotGov/WeatherDotGov";

const KEY = 'WQ0S7HvMWzBP1j91kqF81Ypf80AGX7Dx';


// Icons
library.add(faLocationArrow);

function LocalWeather(props) {
  const [ search, setSearch ] = useState('');
  const [ title, setTitle ] = useState('Your Location');
  const [ latitude, setLatitude ] = useState(null);
  const [ longitude, setLongitude ] = useState(null);
  const [ addressResults, setAddressResults ] = useState([]);
  const browserLat = props.coords ? props.coords.latitude : null;
  const browserLng = props.coords ? props.coords.longitude : null;

  const lat = latitude || browserLat;
  const lng = longitude || browserLng;


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


  const useLocation = () => {
    if (!props.isGeolocationEnabled) {
      alert('Please enable geolocation in your browser or start typing to search.');
    }
    else {
      if (props.coords && props.coords.latitude && props.coords.longitude) {
        setLatitude(props.coords.latitude);
        setLongitude(props.coords.longitude);
      }
      else {
        alert('Sorry, there was a problem getting your location.');
      }
    }
  }


  const chooseResult = result => {
    if (result.place && result.place.geometry && result.place.geometry.coordinates) {
      const [lng, lat] = result.place.geometry.coordinates;
      setLatitude(lat);
      setLongitude(lng);
      setSearch('');
      setAddressResults([]);
      setTitle(result.displayString);
    }
  }


  const clearResults = () => {
    // Short delay so that the user can click an option in the results
    setTimeout(() => {
      setAddressResults([]);
    }, 50);
  }
  

  return (
    <div className="LocalWeather">

      <div className="address-form">
        <h4 className="title">{ title }</h4>
        <input 
          name="address"
          placeholder="Search an address"
          value={ search }
          onBlur={ clearResults }
          onChange={ e => setSearch(e.target.value) } />

        { props.isGeolocationAvailable &&
          <button onClick={ useLocation }>
            <FontAwesomeIcon icon={faLocationArrow} />
          </button>
        }
        { !props.isGeolocationEnabled &&
          <div className="note">Looks like location is disabled in your browser.</div>
        }

        <div className="results">
          { addressResults.map(r => (
              <div key={r.id} className="result" onClick={() => chooseResult(r)}>
                {r.displayString}
              </div>
            ))
          }
        </div>
      </div>

      { lat && lng &&
        <div className="forecast-area">
          <WeatherDotGov lat={lat} lng={lng} />
        </div>
      }
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
    });
  });
}


export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocalWeather);