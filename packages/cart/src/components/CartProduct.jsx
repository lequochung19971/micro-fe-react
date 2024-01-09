import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { usCurrency } from 'shared/utils/usCurrency';

const CartProduct = (props) => {
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
export default CartProduct;
