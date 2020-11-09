import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page', () => {
  render(<App />);
  const titleElement = screen.getByText(/weather findr/i);
  expect(titleElement).toBeInTheDocument();
});
