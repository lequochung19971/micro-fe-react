/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { usCurrency } from 'shared/utils/usCurrency';
import { useEventBus } from 'shared/utils/eventBus';

export default function ProductCard(props) {
  const navigate = useNavigate();
  const eventBus = useEventBus();

  return (
    <Card sx={{ width: 350 }}>
      <CardMedia sx={{ height: 250 }} image={props.images[0]} />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          onClick={() => {
            navigate(props.id.toString());
            console.log(props.id);
          }}>
          {props.title}
        </Typography>
        <Typography gutterBottom variant="subtitle2" component="div" sx={{}}>
          {usCurrency.format(props.price)}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'right',
        }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            eventBus.emit('product.add-cart', {
              id: props.id,
              quantity: 1,
            });
          }}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
