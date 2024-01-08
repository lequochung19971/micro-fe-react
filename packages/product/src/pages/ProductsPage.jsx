import { Box } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useQuery } from '@tanstack/react-query';
import httpClient from 'shared/httpClient';

const ProductsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return httpClient.get('/products').then((res) => res.data.products);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {data?.map((p) => (
        <Box key={p.id} sx={{ padding: '16px' }}>
          <ProductCard {...p} />
        </Box>
      ))}
    </Box>
  );
};

export default ProductsPage;
