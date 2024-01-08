import React from 'react';
import ReactDOM from 'react-dom/client';
import { HostInfoContext } from 'shared/components';
import { EventEmitterContext } from 'shared/utils/eventEmitter';
import { Providers } from '../components/Providers';

export const createMountFunction = (Component) => {
  return function mount(mountPoint, { router: hostRouterInfo = {}, eventEmitter }) {
    const root = ReactDOM.createRoot(mountPoint);

    root.render(
      <React.StrictMode>
        <HostInfoContext.Provider
          value={{
            router: hostRouterInfo,
          }}>
          <EventEmitterContext.Provider value={eventEmitter}>
            <Providers>
              <Component />
            </Providers>
          </EventEmitterContext.Provider>
        </HostInfoContext.Provider>
      </React.StrictMode>
    );

    return root;
  };
};
