import ProductDisplay from '../components/product/ProductDisplay';

export default async function HomeProductsPage() {
  const initialFilter = { category: 'Candle' };

  return (
    <div className="w-full p-4">
      <ProductDisplay initialFilter={initialFilter} />
    </div>
  );
}
