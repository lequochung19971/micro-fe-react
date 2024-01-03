// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import { Navigation } from './components/Navigation';

export const routes = [
  {
    path: '/',
    element: (
      <Navigation remoteName="product">
        <Outlet />
      </Navigation>
    ),
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: ':id',
        element: <ProductPage />,
      },
    ],
  },
];
