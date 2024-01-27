import { Button } from '@mui/material';
import { useEventBus } from 'shared/utils/eventBus';
import { createMountFunction } from '../utils/createMountFunction';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';

export const SignButton = () => {
  const eventBus = useEventBus();
  const [currentUser, setCurrentUser] = useCurrentUser();

  if (currentUser) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        sx={{ fontWeight: 'bold' }}
        onClick={() => {
          setCurrentUser(undefined);
          eventBus.emit('common.router.navigate', {
            to: '/auth/sign-in',
          });
        }}>
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      sx={{ fontWeight: 'bold' }}
      onClick={() => {
        eventBus.emit('common.router.navigate', {
          to: '/auth/sign-in',
        });
      }}>
      Sign In
    </Button>
  );
};
export default createMountFunction(SignButton);
