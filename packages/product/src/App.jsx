import { ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from 'shared/styles';
import './App.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ router }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
