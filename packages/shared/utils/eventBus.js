import { useState } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { useEffect, useRef } from 'react';
import { v4 } from 'uuid';

/**
 * ### Description
 * - This function will create a event emitter includes 3 functions (on, emit, and unbind)
 * ### Methods:
 * #### `on(eventName, listenerName, handler)`
 * ##### Description
 * - Will create listener instance and listen an event is published from `emit()` method.
 * - There are some special features of this method.
 *   - Have lifecycle (initialize, update)
 *   - The listener is always trigger with initialize state if there is a event that the listener is listening in cube.
 * It will handle for the case: the listener can not listen in time when an event is emitted before `on()` method is used.
 *   - For example:
 *     ```
 * emit('event-a')
 * on('event-a', 'listener-a', handler)
 *     ```
 *     In this case: `listener-a` still can get information from `event-a`
 * ##### Lifecycle
 * - initialize: for the first published event.
 * - update: for the next published event.
 *
 * #### `emit(eventName, value)`
 * ##### Description
 * - Will publish a event with a particular value
 *
 * #### `unbind(isRemoveListenerInstance)`
 * ##### Description
 * - Will remove listener from window.removeEventListener
 * - if `isRemoveListenerInstance`, it will also remove listener instance.
 */
// export const createEventEmitter = () => {
//   const events = {};
//   let listeners = [];

//   const on = (eventName, listenerName, handler) => {
//     let currentListener = listeners.find(
//       (l) => l.eventName === eventName && l.name === listenerName
//     );

//     if (!currentListener) {
//       currentListener = {
//         eventName,
//         handler,
//         initialized: false,
//         name: listenerName,
//       };
//       listeners.push(currentListener);
//     }
//     currentListener.handler = handler;

//     const initializeEventName = `${eventName}.initialize`;
//     const updateEventName = `${eventName}.update`;

//     const handleInitialize = (event) => {
//       if (!currentListener.initialized) {
//         currentListener.handler?.({
//           lifecycleState: 'initialize',
//           initialized: false,
//           value: event.detail,
//         });
//       }

//       currentListener.initialized = true;
//     };
//     window.addEventListener(initializeEventName, handleInitialize);

//     const handleUpdate = (event) => {
//       if (currentListener.initialized) {
//         currentListener.handler?.({
//           lifecycleState: 'update',
//           initialized: true,
//           value: event.detail,
//         });
//       }
//     };
//     window.addEventListener(updateEventName, handleUpdate);

//     if (!currentListener?.initialized && events[eventName]) {
//       console.log('Fire initialize event');
//       window.dispatchEvent(
//         new CustomEvent(initializeEventName, {
//           detail: events[eventName].value,
//         })
//       );
//     }

//     console.log('Event Emitter - on - events', events);
//     console.log('Event Emitter - on - listeners', listeners);

//     return (isRemoveListenerInstance) => {
//       window.removeEventListener(initializeEventName, handleInitialize);
//       window.removeEventListener(updateEventName, handleUpdate);

//       if (isRemoveListenerInstance) {
//         listeners = listeners.filter((l) => l.name !== listenerName);
//       }
//     };
//   };

//   const emit = (eventName, value) => {
//     console.log('Event Emitter - on - emit', eventName, value);

//     events[eventName] ??= {
//       name: eventName,
//       value,
//     };

//     events[eventName].value = value;
//     if (!listeners.length) return;

//     const isInitialized = listeners.some((l) => l.eventName === eventName && l.initialized);

//     const initializeEventName = `${eventName}.initialize`;
//     const updateEventName = `${eventName}.update`;

//     if (!isInitialized) {
//       window.dispatchEvent(
//         new CustomEvent(initializeEventName, {
//           detail: value,
//         })
//       );
//     } else {
//       window.dispatchEvent(
//         new CustomEvent(updateEventName, {
//           detail: value,
//         })
//       );
//     }
//   };

//   return {
//     on,
//     emit,
//     get listeners() {
//       return listeners;
//     },
//     get events() {
//       return events;
//     },
//   };
// };

export const EventBusContext = createContext();

export const useEventBus = () => {
  const eventBus = useContext(EventBusContext);

  useEffect(() => {
    if (!eventBus) {
      console.warn('eventBus is not existed');
    }
  }, [eventBus]);

  const on = useCallback((...args) => eventBus?.on?.(...args), [eventBus]);
  const emit = useCallback((...args) => eventBus?.emit?.(...args), [eventBus]);

  return useMemo(
    () => ({
      ...(eventBus ?? {}),
      on,
      emit,
    }),
    [emit, eventBus, on]
  );
};
export const useListenEvent = (eventName, handler, isLateListening = false) => {
  const eventBus = useEventBus();
  const [key] = useState(v4());
  const savedUnbindFn = useRef();

  useEffect(() => {
    if (!eventBus.on) return;
    savedUnbindFn.current = eventBus.on(eventName, key, handler, isLateListening);

    return () => {
      savedUnbindFn.current?.();
    };
  }, [eventBus, eventName, handler, key, isLateListening]);

  // Unmount
  useEffect(
    () => () => {
      savedUnbindFn.current?.(true);
    },
    []
  );
};
