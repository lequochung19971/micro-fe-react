import React from 'react';
import ReactDOM from 'react-dom/client';
import { HostInfoContext } from 'shared/components';
import { EventEmitterContext } from 'shared/utils/eventEmitter';

export const createMountFunction = (Component) => {
  return function mount({ mountPoint, router: hostRouterInfo = {}, eventEmitter }) {
    const root = ReactDOM.createRoot(mountPoint);

    root.render(
      <React.StrictMode>
        <HostInfoContext.Provider
          value={{
            router: hostRouterInfo,
          }}>
          <EventEmitterContext.Provider value={eventEmitter}>
            <Component />
          </EventEmitterContext.Provider>
        </HostInfoContext.Provider>
      </React.StrictMode>
    );

    return root;
  };
};
