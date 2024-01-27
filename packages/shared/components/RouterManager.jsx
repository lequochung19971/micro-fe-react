import { useEffect, useMemo } from 'react';
import { matchRoutes, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { remoteNameConfig } from '../configs/remoteNameConfig';
import { useListenEvent, useEventBus } from '../utils/eventBus';

export function RouterManager({ routes, children, remoteName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const eventBus = useEventBus();

  const [searchParams, setSearchParams] = useSearchParams();
  const parsedSearchParams = useMemo(() => {
    return Object.fromEntries([...searchParams]);
  }, [searchParams]);

  useListenEvent(`${remoteNameConfig.host}.router.update`, ({ value }) => {
    const { pathname, search, state } = value.location;
    const handleNavigating = () => {
      const matchedRoutes = matchRoutes(routes, value.location);
      if (
        location.pathname === pathname ||
        location.pathname === `${pathname}/` ||
        !matchedRoutes?.length
      ) {
        return;
      }
      navigate(pathname, {
        state: state,
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

    handleNavigating();
    handleSearchParams();
  });

  useEffect(() => {
    eventBus.emit(`${remoteName}.router.update`, {
      location: {
        pathname: location.pathname,
        search: location.search,
        state: location.state,
      },
      searchParams: parsedSearchParams,
    });
  }, [eventBus, location, parsedSearchParams, remoteName]);

  return children;
}
