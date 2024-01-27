import { useState } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { useEffect, useRef } from 'react';
import { v4 } from 'uuid';

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
