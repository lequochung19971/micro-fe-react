import { Button } from '@mui/material';
import { useEventEmitter, useListenEvent } from 'shared/utils/eventEmitter';
import { createMountFunction } from '../utils/createMountFunction';
import { useState } from 'react';
import { getCurrentUser } from 'shared/getCurrentUser';

export const SignButton = () => {
  const eventEmitter = useEventEmitter();
  const [isSignedIn, setIsSignedIn] = useState(!!getCurrentUser());

  useListenEvent('storage', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setIsSignedIn(true);
    }
  });

  if (isSignedIn) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        sx={{ fontWeight: 'bold' }}
        onClick={() => {
          localStorage.removeItem('currentUser');
          setIsSignedIn(false);
          eventEmitter.emit('common.router.navigate', {
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
        eventEmitter.emit('common.router.navigate', {
          to: '/auth/sign-in',
        });
      }}>
      Sign In
    </Button>
  );
};
export default createMountFunction(SignButton);
