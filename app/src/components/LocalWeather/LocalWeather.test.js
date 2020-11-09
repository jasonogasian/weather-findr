import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import LocalWeather from './LocalWeather';
import { fetchPredictions, fetchLocations, fetchForecast } from 'lib/fetch'

jest.mock('lib/fetch');

afterEach(() => {
  fetchPredictions.mockReset();
  fetchLocations.mockReset();
  fetchForecast.mockReset();
});

test('typing an address and clicking it gets the forecast', async () => {
  expect.assertions(4);
  
  const searchQuery = '123';
  
  fetchLocations.mockResolvedValue([]);
  fetchPredictions.mockResolvedValue(
    { results: [
      {id:1, displayString:'foo', place: {geometry: {coordinates: [10, 20]}}},
      {id:2, displayString:'bar', place: {geometry: {coordinates: [100, 200]}}},
    ]}
  );
  fetchForecast.mockResolvedValue({
    forecast: {periods: []},
    forecastGridData: {},
  });

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