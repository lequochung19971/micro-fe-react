import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import './App.css';

import { RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from 'shared/styles';
import { EventEmitterContext, createEventEmitter } from 'shared/utils/eventEmitter';

const ProductApp = lazy(() => import('./components/ProductApp'));
const CartApp = lazy(() => import('./components/CartApp'));

export const eventEmitter = createEventEmitter();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/products/*',
        element: (
          <Suspense>
            <ProductApp module="./bootstrap" />
          </Suspense>
        ),
      },
      {
        path: '/carts/*',
        element: (
          <Suspense>
            <CartApp module="./bootstrap" />
          </Suspense>
        ),
      },
    ],
  },
]);

export const navigations = [
  {
    path: '',
    name: 'Home',
  },
  {
    path: 'products',
    name: 'Product',
  },
  {
    path: 'carts',
    name: 'Cart',
  },
];

function App() {
  return (
    <EventEmitterContext.Provider value={eventEmitter}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </EventEmitterContext.Provider>
  );
}

export default App;
