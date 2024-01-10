import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import httpClient from 'shared/httpClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from 'shared/hooks/useCurrentUser';
import CartProduct from '../components/CartProduct';
import { usCurrency } from 'shared/utils/usCurrency';

const Checkout = () => {
  const [currentUser] = useCurrentUser();
  const queryClient = useQueryClient();

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
      products: [...(cartData?.products ?? []), value],
    });
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{
        padding: '20px',
      }}>
      <Grid item xs={7} xl={7}>
        {cartData?.products
          ?.filter((p) => p.quantity > 0)
          ?.map((p) => (
            <CartProduct key={p.id} {...p} onUpdate={updateCart} />
          ))}
      </Grid>
      <Grid item xs={5} xl={5}>
        <Card>
          <CardHeader title="Checkout"></CardHeader>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={5} xl={5}>
                <Typography variant="subtitle2">Total Products</Typography>
              </Grid>
              <Grid item xs={7} xl={7}>
                {usCurrency.format(cartData?.totalProducts ?? 0)}
              </Grid>
              <Grid item xs={5} xl={5}>
                <Typography variant="subtitle2">Total Quantity</Typography>
              </Grid>
              <Grid item xs={7} xl={7}>
                {usCurrency.format(cartData?.totalQuantity ?? 0)}
              </Grid>
              <Grid item xs={5} xl={5}>
                <Typography variant="subtitle2">Total</Typography>
              </Grid>
              <Grid item xs={7} xl={7}>
                {usCurrency.format(cartData?.total ?? 0)}
              </Grid>
              <Grid item xs={5} xl={5}>
                <Typography variant="subtitle2">Discounted Total</Typography>
              </Grid>
              <Grid item xs={7} xl={7}>
                {usCurrency.format(cartData?.discountedTotal ?? 0)}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions
            sx={{
              padding: '16px',
            }}>
            <Button
              variant="contained"
              size="small"
              sx={{
                width: '100%',
              }}>
              Checkout
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Checkout;
