import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import './App.css';

import { RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from 'shared/styles';
import { EventBusContext, createEventEmitter } from 'shared/utils/eventBus';
import { createEventBus } from 'nano-event-bus-ts';

const ProductApp = lazy(() => import('./components/ProductApp'));
const CartApp = lazy(() => import('./components/CartApp'));
const AuthApp = lazy(() => import('./components/AuthApp'));

export const eventBus = createEventBus();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/products/*',
        element: (
          <Suspense>
            <ProductApp />
          </Suspense>
        ),
      },
      {
        path: '/carts/*',
        element: (
          <Suspense>
            <CartApp />
          </Suspense>
        ),
      },
      {
        path: '/auth/*',
        element: (
          <Suspense>
            <AuthApp />
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
    <EventBusContext.Provider value={eventBus}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </EventBusContext.Provider>
  );
}

export default App;
