import { createBrowserRouter, createMemoryRouter } from 'react-router-dom';

export function createRouter({ routes, strategy, initialPathname }) {
  if (strategy === 'standalone') {
    return createBrowserRouter(routes);
  }

  const initialEntries = [initialPathname || '/'];
  return createMemoryRouter(routes, { initialEntries: initialEntries });
}
