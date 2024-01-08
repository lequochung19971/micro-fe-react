import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Drawer,
  IconButton,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { createMountFunction } from '../utils/createMountFunction';
import { useEventEmitter, useListenEvent } from 'shared/utils/eventEmitter';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usCurrency } from '../../../product/src/utils/usCurrency';
import { getCurrentUser } from 'shared/getCurrentUser';
import { useQuery, useMutation } from '@tanstack/react-query';
import httpClient from 'shared/httpClient';
import DeleteIcon from '@mui/icons-material/Delete';
import { queryClient } from './Providers';

const Item = (props) => {
  return (
    <Card sx={{ display: 'flex', marginBottom: '20px' }}>
      <CardMedia
        component="img"
        sx={{ minWidth: 150, height: 150 }}
        image={props.thumbnail}
        alt="product image"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography
            component="div"
            variant="h5"
            title={props.title}
            sx={{
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              width: '262px',
            }}>
            {props.title}
          </Typography>
          <Typography variant="subtitle2" component="div">
            {usCurrency.format(props.price)}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingX: '16px',
            alignItems: 'center',
          }}>
          <Box>
            <TextField
              onChange={(e) =>
                props?.onUpdate?.({
                  id: props.id,
                  quantity: e.target.value,
                })
              }
              type="number"
              value={props.quantity}
              sx={{
                width: '70px',
              }}
              size="small"></TextField>
          </Box>
          <IconButton
            onClick={() =>
              props?.onUpdate?.({
                id: props.id,
                quantity: 0,
              })
            }>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Box>
    </Card>
  );
};

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
  const [currentUser] = useState(() => getCurrentUser());
  const eventEmitter = useEventEmitter();

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
            <Item key={p.id} {...p} onUpdate={updateCart} />
          ))}
      </Box>
    </Drawer>
  );
};

export default createMountFunction(CartDrawer);
