// import { createRouter } from 'shared/createRouter';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './routes';
import { createRouter } from 'shared/utils/createRouter';
import { HostInfoContext } from 'shared/components';
import App from './App';
import { remoteNameConfig } from 'shared/configs';
import { EventEmitterContext } from 'shared/utils/eventEmitter';

const mount = (
  element,
  { initialPathname, routingStrategy, router: hostRouterInfo = {}, eventEmitter }
) => {
  console.log(`${remoteNameConfig.product} mounting`);
  const router = createRouter({ routes, strategy: routingStrategy, initialPathname });
  const root = ReactDOM.createRoot(element);

  root.render(
    <React.StrictMode>
      <HostInfoContext.Provider
        value={{
          router: hostRouterInfo,
        }}>
        <EventEmitterContext.Provider value={eventEmitter}>
          <App router={router} />
        </EventEmitterContext.Provider>
      </HostInfoContext.Provider>
    </React.StrictMode>
  );

  return root;
};
export default mount;
