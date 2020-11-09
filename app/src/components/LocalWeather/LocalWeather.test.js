import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocalWeather from './LocalWeather';
import { fetchPredictions, fetchLocations } from 'lib/fetch'

jest.mock('lib/fetch');

afterEach(() => {
  fetchPredictions.mockReset();
  fetchLocations.mockReset();
});

test('typing an address shows the results', async () => {
  expect.assertions(3);
  
  const searchQuery = '123';

  fetchPredictions.mockResolvedValue(
    { results: [{id:1, displayString:'foo'}, {id:2, displayString:'bar'}] }
  );

  fetchLocations.mockResolvedValue([]);

  render(
    <LocalWeather />
  );

  userEvent.type(screen.getByPlaceholderText(/search/i), searchQuery);
  
  expect(await screen.findByText('foo')).toBeInTheDocument();
  expect(await screen.findByText('bar')).toBeInTheDocument();
  expect(fetchPredictions).toHaveBeenCalledTimes(1);
});