'use client';

import { Product } from '@/types/types';
import ProductCard from './ProductCard';
import { useEffect, useState } from 'react';
import { getProducts } from '@/app/utils/shopify';

export default function ProductDisplayClient({
  pageTitle,
  initialSortType, // Initial sort type passed from the server
  initialFilter = {},
  filters,
}: {
  pageTitle: string;
  initialSortType: string;
  initialFilter?: {
    brand?: string;
    category?: string;
  };
  filters: {
    vendors: string[];
    productTypes: string[];
  };
}) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [sortType, setSortType] = useState(initialSortType);
  const [selectedBrand, setSelectedBrand] = useState(initialFilter.brand || '');
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilter.category || ''
  );
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  const fetchProducts = async () => {
    setLoading(true); // Show loading indicator

    const filter = {
      brand: selectedBrand || '',
      category: selectedCategory || '',
    };

    try {
      const productsData = await getProducts({
        sortType,
        filter,
      });

      setProducts(productsData.edges.map((edge: any) => edge.node));
      setSortedProducts(productsData.edges.map((edge: any) => edge.node));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const sortProducts = () => {
    const sorted = [...products].sort((a, b) => {
      // Sort by price
      if (sortType === 'PRICE:LOWTOHIGH') {
        return (
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
        );
      }
      if (sortType === 'PRICE:HIGHTOLOW') {
        return (
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
        );
      }
      // Sort alphabetically by title
      if (sortType === 'TITLE:ATOZ') {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }
      if (sortType === 'TITLE:ZTOA') {
        return b.title.toLowerCase().localeCompare(a.title.toLowerCase());
      }
      if (sortType === 'CREATED_AT') {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      // Default sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    setSortedProducts(sorted); // Update state with sorted products
  };

  useEffect(() => {
    fetchProducts(); // Trigger fetching products when filters or sort change
  }, [selectedBrand, selectedCategory, sortType]);

  // Trigger sorting whenever sortType or reverse state changes
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-2">
        <h1 className="text-2xl font-semibold">{pageTitle}</h1>
      </div>

      <div className="col-span-2 flex items-center justify-end">
        <label className="mr-2">Sort By:</label>
        <select
          onChange={(e) => setSortType(e.target.value)}
          value={sortType}
          className="border p-1"
        >
          <option value="CREATED_AT">New Arrivals</option>
          <option value="PRICE:LOWTOHIGH">Price: $ - $$$</option>
          <option value="PRICE:HIGHTOLOW">Price: $$$ - $</option>
          <option value="TITLE:ATOZ">Alphabetically: A-Z</option>
          <option value="TITLE:ZTOA">Alphabetically: Z-A</option>
        </select>
      </div>

      <div className="col-span-1 bg-gray-100 p-4">
        <h3 className="mb-4 font-bold">Filter By</h3>

        <div className="mb-4">
          <h4 className="font-semibold">Brand</h4>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border p-2"
          >
            <option>All Brands</option>
            {filters.vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold">Category</h4>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full border p-2"
          >
            <option>All Categories</option>
            {filters.productTypes.map((productType) => (
              <option key={productType}>{productType}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="col-span-3">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {sortedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
