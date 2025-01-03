import ProductsDisplay from '../components/product/ProductsDisplay';

export default async function DecantsPage() {
  const initialFilter = { category: 'Decant' };

  return (
    <main className="w-full p-4">
      <ProductsDisplay initialFilter={initialFilter} />
    </main>
  );
}
