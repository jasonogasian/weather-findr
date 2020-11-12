import React from 'react';
import { useCallback, useEffect, useState } from "react";
import { geolocated } from "react-geolocated";
import { fetchLocations, fetchPredictions } from "lib/fetch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMountain, faSearchLocation } from "@fortawesome/free-solid-svg-icons";
import WeatherDotGov from "components/WeatherDotGov/WeatherDotGov";
import Spinner from "components/Spinner/Spinner";
import { meters2Feet } from "lib/conversions";
import Locations from "components/Locations/Locations";
import { ReactComponent as GPSLocation } from "images/gps-location.svg";


import './LocalWeather.scss';


// Icons
library.add(faMountain, faSearchLocation);

function LocalWeather(props) {
  const [ search, setSearch ] = useState('');
  const [ title, setTitle ] = useState('Your Location');
  const [ latitude, setLatitude ] = useState(null);
  const [ longitude, setLongitude ] = useState(null);
  const [ addressResults, setAddressResults ] = useState([]);
  const [ elevation, setElevation ] = useState('');
  const [ locations, setLocations ] = useState([]);
  const [ showLocations, setShowLocations ] = useState(false);
  const browserLat = props.coords ? props.coords.latitude : null;
  const browserLng = props.coords ? props.coords.longitude : null;

  const lat = latitude || browserLat;
  const lng = longitude || browserLng;


  // Load static locations
  useEffect(() => {
    fetchLocations()
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
      const locationResults = searchLocations(locations, search);

      predict(search)
      .then(resp => {
        const results = locationResults.concat({
          groupLabel: 'Search Results',
          values: resp.results
        });
        setAddressResults(results);
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
    setShowLocations(false);
  }


  const clearResults = () => {
    // Short delay so that the user can click an option in the results
    setTimeout(() => {
      setAddressResults([]);
    }, 10);
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


  const toggleShowLocations = () => {
    setShowLocations(show => !show);
  }
  

  return (
    <div className="LocalWeather">
      <Locations active={ showLocations } data={ locations } onChoose={ handleChooseLocation } />

      <div className="address-form">
        <h4 className="title">{ title }</h4>
        <h6>{ elevation } { elevation ? 'ft' : '--' }</h6>

        <input 
          placeholder="Search an address or summit"
          value={ search }
          onBlur={ clearResults }
          onChange={ e => setSearch(e.target.value) } />

        { props.isGeolocationAvailable &&
          <button className="loc" aria-label="use my location" onClick={ useLocation }>
            <GPSLocation />
          </button>
        }

        <div className="results">
          { addressResults.map(g => (
            <React.Fragment key={g.groupLabel}>
              <div className="result-group">
                { g.groupLabel.match(/search result/i) ?
                  <FontAwesomeIcon icon={ faSearchLocation } />
                  : <FontAwesomeIcon icon={ faMountain } />
                }&nbsp;
                { g.groupLabel }
              </div>
              { g.values.map(r => (
                <div key={r.id} className="result" onClick={() => chooseResult(r)}>
                  {r.displayString}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        { !props.isGeolocationEnabled &&
          <div className="note">Looks like location is disabled in your browser.</div>
        }

        <p>or</p>

        <button className="summit-button" onClick={ toggleShowLocations }>
          Choose a Summit
        </button>
      </div>

      { lat && lng &&
        <div className="forecast-area">
          <WeatherDotGov simple lat={lat} lng={lng} onElevation={ handleElevation } />
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
      resolve([]);
    }
    else {
      fetchPredictions(search)
      .then(resolve)
      .catch(reject);
    }
  });
}


export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(LocalWeather);


function searchLocations(locations, search) {
  const pattern = new RegExp(search, 'i');
  const results = [];
  const addedGroups = {};
  
  locations.forEach(g => {
    const groupLabel = g.groupLabel;

    g.values.forEach(l => {
      if (l.label.match(pattern)) {
        if (!addedGroups[groupLabel]) {
          addedGroups[groupLabel] = {groupLabel, values:[]};
          results.push(addedGroups[groupLabel]);
        }
        addedGroups[groupLabel].values.push({
          displayString: l.label,
          place: {
            geometry: {
              coordinates: [l.geo.lng, l.geo.lat]
            }
          }
        });
      }
    })
  })

  return results;
}