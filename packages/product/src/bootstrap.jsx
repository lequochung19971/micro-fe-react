// import { createRouter } from 'shared/createRouter';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { createRouter } from 'shared/utils';
import { HostInfoContext } from 'shared/components';

const mount = ({ mountPoint, initialPathname, routingStrategy, router: hostRouterInfo = {} }) => {
  console.log('Mount product');
  const router = createRouter({ routes, strategy: routingStrategy, initialPathname });
  const root = ReactDOM.createRoot(mountPoint);

  root.render(
    <React.StrictMode>
      <HostInfoContext.Provider
        value={{
          router: hostRouterInfo,
        }}>
        <RouterProvider router={router} />
      </HostInfoContext.Provider>
    </React.StrictMode>
  );

  return root;
};
export default mount;
