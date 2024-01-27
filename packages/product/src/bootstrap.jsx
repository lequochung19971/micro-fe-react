// import { createRouter } from 'shared/createRouter';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './routes';
import { createRouter } from 'shared/utils/createRouter';
import { HostInfoContext } from 'shared/components';
import App from './App';
import { remoteNameConfig } from 'shared/configs';
import { EventBusContext } from 'shared/utils/eventBus';

const mount = (
  element,
  { initialPathname, routingStrategy, router: hostRouterInfo = {}, eventBus }
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
        <EventBusContext.Provider value={eventBus}>
          <App router={router} />
        </EventBusContext.Provider>
      </HostInfoContext.Provider>
    </React.StrictMode>
  );

  return root;
};
export default mount;
