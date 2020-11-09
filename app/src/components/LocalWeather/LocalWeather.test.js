import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalWeather from './LocalWeather';
import { fetchPredictions, fetchLocations, fetchForecast } from 'lib/fetch';
const locations = require('../../../../data/locations');

jest.mock('lib/fetch');

afterEach(() => {
  fetchPredictions.mockReset();
  fetchLocations.mockReset();
  fetchForecast.mockReset();
});


const predictionsData = { results: [
  {id:1, displayString:'foo', place: {geometry: {coordinates: [10, 20]}}},
  {id:2, displayString:'bar', place: {geometry: {coordinates: [100, 200]}}},
]};


const forecastData = {
  forecast: {periods: []},
  forecastGridData: {},
};


test('typing an address and clicking it gets the forecast', async () => {
  expect.assertions(4);
  
  const searchQuery = '123';
  
  fetchLocations.mockResolvedValue([]);
  fetchPredictions.mockResolvedValue(predictionsData);
  fetchForecast.mockResolvedValue(forecastData);

  render( <LocalWeather /> );

  userEvent.type(screen.getByPlaceholderText(/search/i), searchQuery);
  
  await waitFor(() => {
    expect(screen.getByText('foo')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(fetchPredictions).toHaveBeenCalledTimes(1);
  });
  await waitFor(() => {
    expect(screen.getByText('bar')).toBeInTheDocument();
  });

  await waitFor(() => {
    userEvent.click(screen.getByText('bar'));
  });
  await waitFor(() => {
    expect(fetchForecast).toHaveBeenCalledTimes(1);
  });
});


test('fetches and renders static locations', async () => {
  expect.assertions(locations[0].values.length);

  fetchLocations.mockResolvedValue(locations);
  fetchPredictions.mockResolvedValue(predictionsData);
  fetchForecast.mockResolvedValue(forecastData);

  render( <LocalWeather /> );

  await waitFor(() => {
    for (let i=0; i<locations[0].values.length; i++) {
      expect(screen.getByText(locations[0].values[i].label)).toBeInTheDocument();
    }
  });
});


test('geolocation button shown', async () => {
  // TODO - need better testing of geolocation API
  expect.assertions(1);

  fetchLocations.mockResolvedValue([]);
  fetchPredictions.mockResolvedValue(predictionsData);
  fetchForecast.mockResolvedValue(forecastData);

  render( <LocalWeather /> );

  await waitFor(() => {
    expect(screen.getByRole('button', {name: /use my location/i})).toBeInTheDocument();
  });
});