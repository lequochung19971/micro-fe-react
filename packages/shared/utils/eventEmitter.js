import { createContext, useCallback, useContext } from 'react';

import { useEffect, useRef } from 'react';

export const createEventEmitter = () => {
  const events = {};
  let listeners = [];

  const on = (eventName, handler) => {
    let currentListener = listeners.find((l) => l.eventName === eventName && l.handler === handler);

    if (!currentListener) {
      currentListener = {
        eventName,
        handler,
        initialized: false,
      };
      listeners.push(currentListener);
    }

    const initializationEventName = `${eventName}.initialization`;
    const updateEventName = `${eventName}.update`;

    const handleInitialize = (event) => {
      if (!currentListener.initialized) {
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
      window.dispatchEvent(
        new CustomEvent(initializationEventName, {
          detail: events[eventName].value,
        })
      );
    }

    return () => {
      window.removeEventListener(initializationEventName, handleInitialize);
      window.removeEventListener(updateEventName, handleUpdate);
      listeners = listeners.filter((l) => l.handler !== handler);
    };
  };

  const emit = (eventName, value) => {
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

export const useEventEmitterContext = () => {
  const emitter = useContext(EventEmitterContext);

  useEffect(() => {
    if (!emitter) {
      console.warn('eventEmitter is not existed');
    }
  });

  const on = useCallback((...args) => emitter?.on?.(args), [emitter]);
  const emit = useCallback((...args) => emitter?.emit?.(args), [emitter]);

  return {
    ...(emitter ?? {}),
    on,
    emit,
  };
};
export const useEventEmitter = (eventName, handler) => {
  const eventEmitter = useEventEmitterContext();
  const savedHandler = useRef(handler);

  savedHandler.current = handler;

  useEffect(() => {
    if (!eventEmitter.on) return;

    const unbind = eventEmitter.on(eventName, savedHandler.current);

    return () => {
      unbind?.();
    };
  }, [eventEmitter, eventName]);
};
