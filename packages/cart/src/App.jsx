import { ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from 'shared/styles';

export default function App({ router }) {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
