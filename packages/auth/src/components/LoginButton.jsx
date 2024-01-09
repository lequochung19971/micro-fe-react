import { Button } from '@mui/material';
import { useEventEmitter, useListenEvent } from 'shared/utils/eventEmitter';
import { createMountFunction } from '../utils/createMountFunction';
import { useState } from 'react';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';

export const SignButton = () => {
  const eventEmitter = useEventEmitter();
  const [currentUser, setCurrentUser] = useCurrentUser();

  if (currentUser) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        sx={{ fontWeight: 'bold' }}
        onClick={() => {
          setCurrentUser(undefined);
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
