import './App.css';

import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';

// import CartApplication from 'cart-mfe/App';
import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import MountRemote from './utils/MountRemote';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/products/*',
        element: (
          <Suspense fallback="Loading Product...">
            <MountRemote key="product" remoteName="product" module="./bootstrap" />
          </Suspense>
        ),
      },
      {
        path: '/carts/*',
        element: (
          <Suspense fallback="Loading Cart...">
            <MountRemote key="cart" remoteName="cart" module="./bootstrap" />
          </Suspense>
        ),
      },
    ],
  },
]);

export const navigations = [
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
  console.log('App');
  return <RouterProvider router={router} />;
}

export default App;
