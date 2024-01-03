// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';

export const routes = [
  {
    path: '/',
    element: (
      <Navigation remoteName="cart">
        <Outlet />
      </Navigation>
    ),
    children: [
      {
        index: true,
        element: <div>Carts Page</div>,
      },
      {
        path: ':id',
        element: <div>Cart Detail Page</div>,
      },
    ],
  },
];
