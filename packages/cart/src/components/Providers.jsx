import { ThemeProvider } from '@mui/material';
import { theme } from 'shared/styles';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient();

export const Providers = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};
