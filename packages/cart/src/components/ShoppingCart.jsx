import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createMountFunction } from '../utils/createMountFunction';
import { Badge, IconButton } from '@mui/material';
import { useEventBus, useListenEvent } from 'shared/utils/eventBus';
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from 'shared/httpClient';
import { queryClient } from './Providers';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';

const ShoppingCart = () => {
  const emitter = useEventBus();
  const [currentUser] = useCurrentUser();
  console.log(currentUser);

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
