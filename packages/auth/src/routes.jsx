// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppRouterManager } from './components/AppRouterManager';
import { SignInPage } from './pages/SignInPage';

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
        path: 'sign-in',
        element: <SignInPage />,
      },
    ],
  },
];
