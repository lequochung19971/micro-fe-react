import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createMountFunction } from '../utils/createMountFunction';
import { Badge, IconButton } from '@mui/material';
import { useEventEmitter, useListenEvent } from 'shared/utils/eventEmitter';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from 'shared/httpClient';
import { getCurrentUser } from 'shared/getCurrentUser';
import { queryClient } from './Providers';

const ShoppingCart = () => {
  const emitter = useEventEmitter();
  const [currentUser] = useState(() => getCurrentUser());

  const { data: cartData } = useQuery({
    queryKey: ['carts', { userId: currentUser.id }],
    queryFn: () => {
      return httpClient.get(`/carts/user/${currentUser.id}`).then((res) => res.data?.carts?.[0]);
    },
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
      // queryClient.invalidateQueries(['carts', { userId: currentUser.id }]);
      queryClient.setQueryData(['carts', { userId: currentUser.id }], data);
    },
  });

  useListenEvent('product.add-cart', ({ value }) => {
    console.log(value);
    mutate({
      merge: true, // this will include existing products in the cart
      products: [value],
    });
  });

  return (
    <IconButton
      size="small"
      sx={{
        marginLeft: '8px',
      }}
      onClick={() => {
        emitter.emit('cart.side-bar.open');
      }}>
      <Badge badgeContent={cartData?.totalQuantity} color="error">
        <ShoppingCartIcon
          sx={{
            color: '#FFFFFF',
          }}
        />
      </Badge>
    </IconButton>
  );
};

export default createMountFunction(ShoppingCart);
