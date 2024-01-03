/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function ProductCard(props) {
  const navigate = useNavigate();
  return (
    <Card sx={{ maxWidth: 350 }}>
      <CardMedia sx={{ height: 250 }} image={props.image} title="green iguana" />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            cursor: 'pointer',
          }}
          onClick={() => navigate(props.id)}>
          {props.title}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'right',
        }}>
        <Button size="small" variant="contained">
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
