import { Box } from '@mui/material';
import { mockedProducts } from 'shared/mockedProducts';
import ProductCard from '../components/ProductCart';
import { useNavigate } from 'react-router-dom';

const ProductsPage = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {mockedProducts.map((p) => (
        <Box key={p.id} sx={{ padding: '16px' }}>
          <ProductCard {...p} />
        </Box>
      ))}
    </Box>
  );
};

export default ProductsPage;
