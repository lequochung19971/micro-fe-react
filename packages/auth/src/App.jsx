import { RouterProvider } from 'react-router-dom';
import './App.css';
import { Providers } from './components/Providers';

export default function App({ router }) {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
