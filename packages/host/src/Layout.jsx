import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Box } from '@mui/material';

const Layout = () => {
  return (
    <>
      <Header />
      <Box sx={{ marginTop: '100px' }}>
        <Outlet />
      </Box>
    </>
  );
};
export default Layout;
