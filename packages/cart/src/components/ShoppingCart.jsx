import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createMountFunction } from '../utils/createMountFunction';
import { IconButton } from '@mui/material';

const ShoppingCart = () => {
  return (
    <IconButton
      size="small"
      sx={{
        marginLeft: '8px',
      }}>
      <ShoppingCartIcon
        sx={{
          color: '#FFFFFF',
        }}
      />
    </IconButton>
  );
};

export default createMountFunction(ShoppingCart);
