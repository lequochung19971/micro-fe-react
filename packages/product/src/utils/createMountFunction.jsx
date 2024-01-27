import React from 'react';
import ReactDOM from 'react-dom/client';
import { HostInfoContext } from 'shared/components';
import { EventBusContext } from 'shared/utils/eventBus';

export const createMountFunction = (Component) => {
  return function mount(mountPoint, { router: hostRouterInfo = {}, eventBus }) {
    const root = ReactDOM.createRoot(mountPoint);

    root.render(
      <React.StrictMode>
        <HostInfoContext.Provider
          value={{
            router: hostRouterInfo,
          }}>
          <EventBusContext.Provider value={eventBus}>
            <Component />
          </EventBusContext.Provider>
        </HostInfoContext.Provider>
      </React.StrictMode>
    );

    return root;
  };
};
