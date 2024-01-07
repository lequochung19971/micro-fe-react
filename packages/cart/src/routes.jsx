// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
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
        element: <div>Carts Page Test</div>,
      },
      {
        path: ':id',
        element: <div>Cart Detail Page</div>,
      },
    ],
  },
];
