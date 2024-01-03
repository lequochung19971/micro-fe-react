import { useEffect, useMemo } from 'react';
import { matchRoutes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useHostInfoContext } from '../HostInfoContext';
import { routes } from '../routes';

export function NavigationManager({ children, remoteName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hostInfo = useHostInfoContext();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    function shellNavigationHandler(event) {
      const pathname = event.detail;
      if (location.pathname === pathname || !matchRoutes(routes, { pathname })) {
        return;
      }
      navigate(pathname, {
        state: location.state,
      });
    }

    window.addEventListener('host.navigated', shellNavigationHandler);

    return () => {
      window.removeEventListener('host.navigated', shellNavigationHandler);
    };
  }, [location, navigate]);

  const parsedSearchParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  useEffect(() => {
    if (!hostInfo.router) return;

    const rootParams = Object.fromEntries([...(hostInfo?.router?.searchParams ?? {})]);
    if (!parsedSearchParams || !rootParams) return;
    if (JSON.stringify(parsedSearchParams) === JSON.stringify(rootParams)) {
      return;
    }

    setSearchParams(rootParams);
  }, [parsedSearchParams, hostInfo, setSearchParams]);

  useEffect(() => {
    function handler(event) {
      const params = event.detail;
      if (!parsedSearchParams || !params) return;
      if (JSON.stringify(parsedSearchParams) === JSON.stringify(params)) {
        return;
      }
      setSearchParams(params);
    }

    window.addEventListener('host.searchParams', handler);

    return () => {
      window.removeEventListener('host.searchParams', handler);
    };
  }, [location, parsedSearchParams, setSearchParams]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(`${remoteName}.navigated`, { detail: location.pathname }));
  }, [location, remoteName]);

  useEffect(() => {
    if (!location.search) return;

    window.dispatchEvent(
      new CustomEvent(`${remoteName}.searchParams`, { detail: parsedSearchParams })
    );
  }, [location, parsedSearchParams, remoteName]);

  return children;
}
