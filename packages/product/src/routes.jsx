// eslint-disable-next-line no-unused-vars
import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { AppRouterManager } from './components/AppRouterManager';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));

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
        element: (
          <React.Suspense>
            <ProductsPage />
          </React.Suspense>
        ),
      },
      {
        path: ':id',
        element: (
          <React.Suspense>
            <ProductPage />
          </React.Suspense>
        ),
      },
    ],
  },
];
