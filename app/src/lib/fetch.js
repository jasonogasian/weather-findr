
//
// Fetch all available static locations from the server
//
export const fetchLocations = () => {
  return new Promise((resolve, reject) => {
    fetch('/api/v1/locations')
    .then(response => resolve(response.json()))
    .catch(reject);
  });
}


//
// Fetch geolocation predictions from Mapquest API
//
const KEY = 'WQ0S7HvMWzBP1j91kqF81Ypf80AGX7Dx';
export const fetchPredictions = search=> {
  return new Promise((resolve, reject) => {
    const url = `https://www.mapquestapi.com/search/v3/prediction?key=${KEY}&limit=5&collection=poi,address&q=${search}`;
    fetch(url)
    .then(response => resolve(response.json()))
    .catch(reject);
  });
}


//
// Fetch forecast for given lag/lng from weather.gov API
//
export const fetchForecast = (lat, lng) => {
  return new Promise((resolve, reject) => {
    const url = `/api/v1/forecast?lat=${lat.toFixed(5)}&lng=${lng.toFixed(5)}`;
    const headers = new Headers({
      "Accept": "application/geo+json",
      "User-Agent": "(tahoe-bc-ski-forecast.com, jason@ogasian.com)"
    });
    fetch(url, {
      method  : 'GET', 
      headers : headers,
    })
    .then(response => resolve(response.json()))
    .catch(reject);
  });
}