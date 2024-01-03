import { useEffect, useMemo } from 'react';
import { matchRoutes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { remoteNameConfig } from '../configs/remoteNameConfig';
import { useHostInfoContext } from './HostInfoContext';

export function NavigationManager({ routes, children, remoteName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hostInfo = useHostInfoContext();
  const { router: hostRouterInfo = {} } = hostInfo;

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    function handler(event) {
      const pathname = event.detail;
      if (location.pathname === pathname || !matchRoutes(routes, { pathname })) {
        return;
      }
      navigate(pathname, {
        state: location.state,
      });
    }

    window.addEventListener(`${remoteNameConfig.host}.navigated`, handler);

    return () => {
      window.removeEventListener(`${remoteNameConfig.host}.navigated`, handler);
    };
  }, [location, navigate, routes]);

  const parsedSearchParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  useEffect(() => {
    function handler(event) {
      const params = event.detail;
      if (!parsedSearchParams || !params) return;
      if (JSON.stringify(parsedSearchParams) === JSON.stringify(params)) {
        return;
      }
      setSearchParams(params);
    }

    window.addEventListener(`${remoteNameConfig.host}.searchParams`, handler);

    return () => {
      window.removeEventListener(`${remoteNameConfig.host}.searchParams`, handler);
    };
  }, [location, parsedSearchParams, setSearchParams]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(`${remoteName}.navigated`, { detail: location.pathname }));
  }, [hostRouterInfo, location.pathname, remoteName]);

  useEffect(() => {
    if (!location.search) return;

    window.dispatchEvent(
      new CustomEvent(`${remoteName}.searchParams`, { detail: parsedSearchParams })
    );
  }, [location, parsedSearchParams, remoteName]);

  return children;
}
