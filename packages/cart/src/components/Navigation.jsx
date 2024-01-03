import { NavigationManager } from 'shared/components';
import { routes } from '../routes';

export function Navigation({ children, remoteName }) {
  return (
    <NavigationManager remoteName={remoteName} routes={routes}>
      {children}
    </NavigationManager>
  );
}
