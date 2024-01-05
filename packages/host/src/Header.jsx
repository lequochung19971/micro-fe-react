import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { navigations } from './App';
import { useNavigate } from 'react-router-dom';

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
            <Box
              sx={{
                marginLeft: '8px',
              }}></Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
