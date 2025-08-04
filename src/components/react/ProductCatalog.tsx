import React, { useState, useEffect } from "react";
import { fetchProducts } from "../../lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductCatalogProps {
  category?: string;
  limit?: number;
}

export default function ProductCatalog({ category = "all", limit = 6 }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(category);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts(filter, limit);

        if (response.status === "success") {
          setProducts(response.data);
        } else {
          console.error("Failed to load products");
        }
      } catch (err) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filter, limit]);

  const categories = ["all", "electronics", "home", "sports"];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Product Catalog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Product Catalog</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === cat ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-blue-600 font-bold text-lg">${product.price}</p>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-gray-500 py-8">No products found in this category.</p>}
    </div>
  );
}
