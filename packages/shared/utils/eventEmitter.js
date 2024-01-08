import { useState } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { useEffect, useRef } from 'react';
import { v4 } from 'uuid';

export const createEventEmitter = () => {
  const events = {};
  let listeners = [];

  const on = (eventName, key, handler) => {
    let currentListener = listeners.find((l) => l.eventName === eventName && l.key === key);

    if (!currentListener) {
      currentListener = {
        eventName,
        handler,
        initialized: false,
        key,
      };
      listeners.push(currentListener);
    }
    currentListener.handler = handler;

    const initializationEventName = `${eventName}.initialization`;
    const updateEventName = `${eventName}.update`;

    const handleInitialize = (event) => {
      if (!currentListener.initialized) {
        console.log('initialization', key, eventName);
        currentListener.handler?.({
          lifecycleState: 'initialization',
          initialized: false,
          value: event.detail,
        });
      }

      currentListener.initialized = true;
    };
    window.addEventListener(initializationEventName, handleInitialize);

    const handleUpdate = (event) => {
      if (currentListener.initialized) {
        currentListener.handler?.({
          lifecycleState: 'update',
          initialized: true,
          value: event.detail,
        });
      }
    };
    window.addEventListener(updateEventName, handleUpdate);

    if (!currentListener?.initialized && events[eventName]) {
      console.log('Fire initialization event');
      window.dispatchEvent(
        new CustomEvent(initializationEventName, {
          detail: events[eventName].value,
        })
      );
    }

    console.log('Event Emitter - on - events', events);
    console.log('Event Emitter - on - listeners', listeners);

    return (isRemoveListenerInstance) => {
      window.removeEventListener(initializationEventName, handleInitialize);
      window.removeEventListener(updateEventName, handleUpdate);

      if (isRemoveListenerInstance) {
        listeners = listeners.filter((l) => l.key !== key);
      }
    };
  };

  const emit = (eventName, value) => {
    console.log('Event Emitter - on - emit', eventName, value);

    events[eventName] ??= {
      name: eventName,
      value,
    };

    events[eventName].value = value;
    if (!listeners.length) return;

    const isInitialized = listeners.some((l) => l.eventName === eventName && l.initialized);

    const initializationEventName = `${eventName}.initialization`;
    const updateEventName = `${eventName}.update`;

    if (!isInitialized) {
      window.dispatchEvent(
        new CustomEvent(initializationEventName, {
          detail: value,
        })
      );
    } else {
      window.dispatchEvent(
        new CustomEvent(updateEventName, {
          detail: value,
        })
      );
    }
  };

  return {
    on,
    emit,
    get listeners() {
      return listeners;
    },
    get events() {
      return events;
    },
  };
};

export const EventEmitterContext = createContext();

export const useEventEmitter = () => {
  const emitter = useContext(EventEmitterContext);

  useEffect(() => {
    if (!emitter) {
      console.warn('eventEmitter is not existed');
    }
  }, [emitter]);

  const on = useCallback((...args) => emitter?.on?.(...args), [emitter]);
  const emit = useCallback((...args) => emitter?.emit?.(...args), [emitter]);

  return useMemo(
    () => ({
      ...(emitter ?? {}),
      on,
      emit,
    }),
    [emit, emitter, on]
  );
};
export const useListenEvent = (eventName, handler) => {
  const eventEmitter = useEventEmitter();
  const [key] = useState(v4());
  const savedUnbindFn = useRef();

  useEffect(() => {
    if (!eventEmitter.on) return;
    savedUnbindFn.current = eventEmitter.on(eventName, key, handler);

    return () => {
      savedUnbindFn.current?.();
    };
  }, [eventEmitter, eventName, handler, key]);

  // Unmount
  useEffect(
    () => () => {
      savedUnbindFn.current?.(true);
    },
    []
  );
};
