import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  return <div>Product {id}</div>;
};

export default ProductPage;
