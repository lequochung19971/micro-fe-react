import { useRef, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { remoteConfigs } from '../remoteConfigs';
import { eventBus } from '../App';
import { useListenEvent, useEventBus } from 'shared/utils/eventBus';

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
  const [ready, setReady] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    if (urlCache.has(url)) {
      setReady(true);
      setIsError(false);
      return;
    }

    setReady(false);
    setIsError(false);
    setIsLoading(true);

    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      urlCache.add(url);
      setReady(true);
      setIsLoading(false);
    };

    element.onerror = () => {
      setReady(false);
      setIsError(true);
      setIsLoading(false);
    };

    document.head.appendChild(element);

    // return () => {
    //   urlCache.delete(url);
    //   document.head.removeChild(element);
    // };
  }, [url]);

  return {
    isError,
    isLoading,
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
  const eventBus = useEventBus();

  const parsedSearchParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  // Listen to navigation events dispatched inside app1 mfe.
  useListenEvent(`${remoteName}.router.update`, ({ value }) => {
    const { search, pathname } = value.location;
    const handleNavigation = () => {
      const remotePathname = pathname;
      const newPathname =
        remotePathname === '/' || remotePathname === ''
          ? remoteBasePathname
          : `${remoteBasePathname}${remotePathname}`;

      if (newPathname === location.pathname) {
        return;
      }

      navigate(newPathname, {
        state: location.state,
      });
    };

    const handleSearchParams = () => {
      const params = value.searchParams;
      if (!parsedSearchParams || !params || !search) return;

      if (JSON.stringify(parsedSearchParams) === JSON.stringify(params)) {
        return;
      }
      setSearchParams(params);
    };

    handleNavigation();
    handleSearchParams();
  });

  useEffect(() => {
    if (!location.pathname.startsWith(remoteBasePathname)) return;

    eventBus.emit(`${hostConfig.name}.router.update`, {
      location: {
        pathname: location.pathname.replace(remoteBasePathname, ''),
        state: location.state,
        search: location.search,
      },
      searchParams: parsedSearchParams,
    });
  }, [
    eventBus,
    hostConfig.name,
    location.pathname,
    location.search,
    location.state,
    parsedSearchParams,
    remoteBasePathname,
  ]);
};

const useMountRemote = ({ remoteName, module, mountPointRef }) => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoadingModule, setIsLoadingModule] = useState(true);

  const remoteConfig = useMemo(() => remoteConfigs[remoteName], [remoteName]);
  const { ready, isError, isLoading: isLoadingRemoteScript } = useDynamicScript(remoteConfig.url);

  const remoteRef = useRef();

  const moduleKey = `${remoteConfig.url}-${remoteConfig.scope}-${module}`;

  // Mount remote app
  useEffect(() => {
    if (!mountPointRef.current) {
      return;
    }

    if (isError) {
      setIsLoadingModule(false);
      mountPointRef.current.innerText = `Error loading remote module: "${module}"`;
    }

    if (ready && !remoteRef.current)
      (async () => {
        try {
          const m = await loadModule(remoteConfig.scope, module);
          const mount = m.default;
          if (!mount) {
            throw Error('Do not have mount function');
          }
          remoteRef.current = mount(mountPointRef.current, {
            initialPathname: location.pathname.replace(remoteConfig.pathname, ''),
            eventBus,
            router: {
              location,
              searchParams,
              setSearchParams,
              navigate,
            },
          });
        } finally {
          setIsLoadingModule(false);
        }
      })();
  }, [
    isError,
    location,
    module,
    navigate,
    ready,
    remoteConfig.pathname,
    remoteConfig.scope,
    searchParams,
    setSearchParams,
    mountPointRef,
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

  return {
    isLoading: isLoadingModule || isLoadingRemoteScript,
  };
};

export const MountRemoteApp = ({ remoteName, module, loadingElement }) => {
  const mountPointRef = useRef(null);
  const { isLoading } = useMountRemote({ mountPointRef, module, remoteName });
  useSyncRoute({ remoteName });

  return (
    <>
      {isLoading && !!loadingElement && loadingElement}
      <div
        style={{ display: isLoading ? 'none' : 'block' }}
        ref={mountPointRef}
        className="remote-app-slot"
      />
    </>
  );
};

export const MountRemoteComponent = ({ remoteName, module, loadingElement }) => {
  const mountPointRef = useRef(null);
  const { isLoading } = useMountRemote({ mountPointRef, module, remoteName });

  return (
    <>
      {isLoading && !!loadingElement && loadingElement}
      <div
        style={{ display: isLoading ? 'none' : 'block' }}
        ref={mountPointRef}
        className="remote-component-slot"
      />
    </>
  );
};
