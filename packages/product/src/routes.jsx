// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import { AppRouterManager } from './components/AppRouterManager';

export const routes = [
  {
    path: '/',
    element: (
      <AppRouterManager>
        <Outlet />
      </AppRouterManager>
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
