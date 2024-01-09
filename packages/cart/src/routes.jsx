// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppRouterManager } from './components/AppRouterManager';
import CartPage from './pages/CartPage';

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
        element: <CartPage />,
      },
      {
        path: ':id',
        element: <div>Cart Detail Page</div>,
      },
    ],
  },
];
