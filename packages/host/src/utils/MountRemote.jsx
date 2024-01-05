import { useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { remoteConfigs } from '../remoteConfigs';
import { eventEmitter } from '../App';
import { useEventEmitter, useEventEmitterContext } from 'shared/utils/eventEmitter';

const loadModule = async (scope, module) => {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  // eslint-disable-next-line no-undef
  await __webpack_init_sharing__('default');
  const container = window[scope]; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  // eslint-disable-next-line no-undef
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  return factory();
};

const urlCache = new Set();
const useDynamicScript = (url) => {
  console.log('urlCache', urlCache);
  const [ready, setReady] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setErrorLoading(false);
      return;
    }

    setReady(false);
    setErrorLoading(false);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
    };

    element.onerror = () => {
      setReady(false);
      setErrorLoading(true);
    };

    document.head.appendChild(element);

    // return () => {
    //   urlCache.delete(url);
    //   document.head.removeChild(element);
    // };
  }, [url]);

  return {
    errorLoading,
    ready,
  };
};

const useSyncRoute = ({ remoteName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const remoteConfig = useMemo(() => remoteConfigs[remoteName], [remoteName]);
  const { pathname: remoteBasePathname } = remoteConfig;
  const hostConfig = useMemo(() => remoteConfigs.host, []);
  const eventEmitter = useEventEmitterContext();

  // Listen to navigation events dispatched inside app1 mfe.
  // useEffect(() => {
  //   const handleNavigated = (event) => {
  //     const remotePathname = event.detail;
  //     const newPathname =
  //       remotePathname === '/' ? remoteBasePathname : `${remoteBasePathname}${remotePathname}`;

  //     if (newPathname === location.pathname) {
  //       return;
  //     }

  //     navigate(newPathname, {
  //       state: location.state,
  //     });
  //   };
  //   window.addEventListener(`${remoteName}.navigated`, handleNavigated);

  //   return () => {
  //     window.removeEventListener(`${remoteName}.navigated`, handleNavigated);
  //   };
  // }, [location, navigate, remoteBasePathname, remoteName]);
  useEventEmitter(`${remoteName}.navigated`, ({ value }) => {
    const remotePathname = value;
    const newPathname =
      remotePathname === '/' ? remoteBasePathname : `${remoteBasePathname}${remotePathname}`;

    if (newPathname === location.pathname) {
      return;
    }

    navigate(newPathname, {
      state: location.state,
    });
  });

  // Listen for host location changes and dispatch a notification.
  useEffect(() => {
    if (location.pathname.startsWith(remoteBasePathname)) {
      eventEmitter.emit(
        `${hostConfig.name}.navigated`,
        location.pathname.replace(remoteBasePathname, '')
      );
      // window.dispatchEvent(
      //   new CustomEvent(`${hostConfig.name}.navigated`, {
      //     detail: location.pathname.replace(remoteBasePathname, ''),
      //   })
      // );
    }
    /**
     * `isRemoteMounted`
     * If the remote is mounted, host will re-dispatch an event to sync route context for remote at initial
     */
  }, [eventEmitter, hostConfig.name, location.pathname, remoteBasePathname]);

  const parsedSearchParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  // useEffect(() => {
  //   const handlerSearchParams = (event) => {
  //     const params = event.detail;
  //     if (!parsedSearchParams || !params) return;

  //     if (JSON.stringify(parsedSearchParams) === JSON.stringify(params)) {
  //       return;
  //     }
  //     setSearchParams(params);
  //   };
  //   window.addEventListener(`${remoteName}.searchParams`, handlerSearchParams);

  //   return () => {
  //     window.removeEventListener(`${remoteName}.searchParams`, handlerSearchParams);
  //   };
  // }, [location, parsedSearchParams, remoteName, setSearchParams]);

  useEventEmitter(`${remoteName}.searchParams`, ({ value }) => {
    const params = value;
    if (!parsedSearchParams || !params) return;

    if (JSON.stringify(parsedSearchParams) === JSON.stringify(params)) {
      return;
    }
    setSearchParams(params);
  });

  // Listen for host location changes and dispatch a notification.
  useEffect(() => {
    if (!location.search) return;

    if (location.pathname.startsWith(remoteBasePathname)) {
      eventEmitter.emit(`${hostConfig.name}.searchParams`, parsedSearchParams);
      // window.dispatchEvent(
      //   new CustomEvent(`${hostConfig.name}.searchParams`, {
      //     detail: parsedSearchParams,
      //   })
      // );
    }
    /**
     * `isRemoteMounted`
     * If the remote is mounted, host will re-dispatch an event to sync route context for remote at initial
     */
  }, [
    eventEmitter,
    hostConfig.name,
    location.pathname,
    location.search,
    parsedSearchParams,
    remoteBasePathname,
  ]);

  return {
    location,
    navigate,
    searchParams,
    setSearchParams,
    initialPathname: location.pathname.replace(remoteBasePathname, ''),
  };
};
const MountRemote = ({ remoteName, module }) => {
  const mountPointRef = useRef(null);
  const [isRemoteMounted, setIsRemoteMounted] = useState(false);

  const { initialPathname, location, navigate, searchParams, setSearchParams } = useSyncRoute({
    remoteName,
    isRemoteMounted,
  });

  const remoteConfig = useMemo(() => remoteConfigs[remoteName], [remoteName]);
  const { ready, errorLoading } = useDynamicScript(remoteConfig.url);

  const remoteRef = useRef();

  const moduleKey = `${remoteConfig.url}-${remoteConfig.scope}-${module}`;

  // Mount remote app
  useEffect(() => {
    if (!mountPointRef.current) {
      return;
    }

    if (errorLoading) {
      mountPointRef.current.innerText = `Error loading remote module: "${module}"`;
    }

    if (ready && !remoteRef.current)
      (async () => {
        const m = await loadModule(remoteConfig.scope, module);

        const mount = m.default;
        if (!mount) {
          throw Error('Do not have mount function');
        }
        remoteRef.current = mount({
          mountPoint: mountPointRef.current,
          initialPathname,
          eventEmitter,
          router: {
            location,
            searchParams,
            setSearchParams,
            navigate,
          },
        });
        setIsRemoteMounted(true);
      })();
  }, [
    errorLoading,
    initialPathname,
    location,
    module,
    moduleKey,
    navigate,
    ready,
    remoteConfig.module,
    remoteConfig.scope,
    searchParams,
    setSearchParams,
  ]);

  /**
   * To unmount current remote app
   */
  useEffect(() => {
    return () => {
      queueMicrotask(() => {
        remoteRef.current?.unmount?.();
        remoteRef.current = undefined;
      });
    };
  }, [moduleKey]);

  return <div ref={mountPointRef} id={`mfe-${remoteConfig.name}`} />;
};
export default MountRemote;
