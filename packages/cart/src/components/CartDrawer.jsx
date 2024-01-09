import { Box, Button, Drawer, IconButton, styled, useTheme } from '@mui/material';
import { createMountFunction } from '../utils/createMountFunction';
import { useEventEmitter, useListenEvent } from 'shared/utils/eventEmitter';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from 'shared/httpClient';
import { queryClient } from './Providers';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';
import CartProduct from './CartProduct';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  height: '68px',
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [currentUser] = useCurrentUser();
  const eventEmitter = useEventEmitter();

  const { data: cartData } = useQuery({
    queryKey: ['carts', { userId: currentUser?.id }],
    queryFn: () => {
      return httpClient.get(`/carts/user/${currentUser?.id}`).then((res) => res.data?.carts?.[0]);
    },
    enabled: !!currentUser?.id,
  });

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient.patch(`/carts/${cartData?.id}`, data).then((res) => {
        return res.data;
      });
    },
    onSuccess: (data) => {
      /**
       * update query or invalidate query
       */
      // queryClient.invalidateQueries(['carts', { userId: currentUser?.id }]);
      queryClient.setQueryData(['carts', { userId: currentUser?.id }], data);
    },
  });

  const updateCart = (value) => {
    mutate({
      products: [...cartData.products, value],
    });
  };

  useListenEvent('cart.side-bar.open', () => {
    setOpen(true);
  });

  return (
    <Drawer
      sx={{
        overflow: 'hidden',
        '& .MuiDrawer-paper': {
          width: '500px',
          boxSizing: 'border-box',
        },
        '& .MuiPaper-root': {
          overflow: 'hidden',
        },
      }}
      anchor="right"
      onClose={() => setOpen(false)}
      open={open}>
      <DrawerHeader
        sx={{
          display: 'flex',
        }}>
        <IconButton onClick={() => setOpen(false)}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Button
          variant="contained"
          size="small"
          sx={{
            marginRight: '16px',
          }}
          onClick={() => {
            setOpen(false);
            eventEmitter.emit('common.router.navigate', {
              to: '/carts',
            });
          }}>
          Cart Page
        </Button>
      </DrawerHeader>
      <Box
        sx={{
          padding: '20px',
          overflow: 'auto',
        }}>
        {cartData?.products
          ?.filter((p) => p.quantity > 0)
          ?.map((p) => (
            <CartProduct key={p.id} {...p} onUpdate={updateCart} />
          ))}
      </Box>
    </Drawer>
  );
};

export default createMountFunction(CartDrawer);
