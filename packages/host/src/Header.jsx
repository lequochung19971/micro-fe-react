import { AppBar, Box, Button, Container, Skeleton, Toolbar } from '@mui/material';
import { navigations } from './App';
import { useNavigate } from 'react-router-dom';
import { MountRemoteComponent } from './components/MountRemote';
import { remoteNameConfig } from 'shared/configs';

const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}>
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {navigations.map((navigation) => (
                <Button
                  key={navigation.name}
                  onClick={() => navigate(navigation.path)}
                  sx={{ my: 2, color: 'white', display: 'block', fontWeight: 'bold' }}>
                  {navigation.name}
                </Button>
              ))}
            </Box>

            <Button variant="outlined" color="secondary" sx={{ fontWeight: 'bold' }}>
              Login
            </Button>

            <MountRemoteComponent
              remoteName={remoteNameConfig.cart}
              module="./ShoppingCart"
              loadingElement={
                <Skeleton width={34} height={34} variant="circular" sx={{ marginLeft: '8px' }} />
              }
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
