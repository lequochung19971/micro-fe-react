import { RouterManager } from 'shared/components';
import { routes } from '../routes';
import { remoteNameConfig } from 'shared/configs';

export function AppRouterManager({ children }) {
  return (
    <RouterManager remoteName={remoteNameConfig.product} routes={routes}>
      {children}
    </RouterManager>
  );
}
