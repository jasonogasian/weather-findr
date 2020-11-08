import { useCallback, useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import WeatherDotGov from "components/WeatherDotGov/WeatherDotGov";
import Spinner from "components/Spinner/Spinner";
import { meters2Feet } from "lib/conversions";

import './LocalWeather.scss';
import Locations from "components/Locations/Locations";

const KEY = 'WQ0S7HvMWzBP1j91kqF81Ypf80AGX7Dx';


// Icons
library.add(faLocationArrow);

function LocalWeather(props) {
  const [ search, setSearch ] = useState('');
  const [ title, setTitle ] = useState('Your Location');
  const [ latitude, setLatitude ] = useState(null);
  const [ longitude, setLongitude ] = useState(null);
  const [ addressResults, setAddressResults ] = useState([]);
  const [ elevation, setElevation ] = useState('');
  const [ locations, setLocations ] = useState([]);
  const browserLat = props.coords ? props.coords.latitude : null;
  const browserLng = props.coords ? props.coords.longitude : null;

  const lat = latitude || browserLat;
  const lng = longitude || browserLng;


  // Load static locations
  useEffect(() => {
    fetch('/api/v1/locations')
    .then(response => response.json())
    .then(data => {
      if (data && data.length) {
        setLocations(data);
      }
      else {
        alert('Oops, there was a problem loading locations. Please refresh the page to try again');
      }
    })
  }, []);


  // Fetch address predictions
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
      updateChosen(result.displayString, lat, lng);
    }
  }


  const handleChooseLocation = loc => {
    updateChosen(loc.label, loc.geo.lat, loc.geo.lng);
  }


  const clearResults = () => {
    // Short delay so that the user can click an option in the results
    setTimeout(() => {
      setAddressResults([]);
    }, 50);
  }


  const updateChosen = (label, lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setElevation('');
    setSearch('');
    setAddressResults([]);
    setTitle(label);
  }


  // Memoized to prevent re-renders of WeatherDotGov component
  const handleElevation = useCallback(e => {
    let elev = e.value;
    if (e.unitCode.match(/:m$/)) {
      elev = meters2Feet(e.value);
    }
    setElevation(Math.round(elev));
  }, [setElevation]);
  

  return (
    <div className="LocalWeather">
      <Locations data={ locations } onChoose={ handleChooseLocation } />

      <div className="address-form">
        <h4 className="title">{ title }</h4>
        <h6>{ elevation } { elevation ? 'ft' : '--' }</h6>

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
          <WeatherDotGov lat={lat} lng={lng} onElevation={ handleElevation } />
        </div>
      }

      { props.isGeolocationEnabled && !lat && !lng && 
        <Spinner />
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