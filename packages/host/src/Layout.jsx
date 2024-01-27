import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useListenEvent } from 'shared/utils/eventBus';
import { MountRemoteComponent } from './components/MountRemote';
import { remoteNameConfig } from 'shared/configs';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';

const useParentRouteAction = () => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  /**
   * Listen navigate action from any remotes
   */
  useListenEvent(
    'common.router.navigate',
    ({ value = {} }) => {
      const { to, options } = value;
      navigate(to, options);
    },
    true
  );

  /**
   * Listen searchParams action from any remotes
   */
  useListenEvent(
    'common.router.searchParams',
    ({ value = {} }) => {
      setSearchParams(value);
    },
    true
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser] = useCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/sign-in');
    } else {
      if (location.pathname === '/auth/sign-in') {
        navigate('/');
      }
    }
  }, [currentUser, location.pathname, navigate]);

  useParentRouteAction();

  return (
    <>
      <Header />
      <Box sx={{ marginTop: '68px' }}>
        <Outlet />
      </Box>
      <MountRemoteComponent remoteName={remoteNameConfig.cart} module="./CartDrawer" />
    </>
  );
};
export default Layout;
