import { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Plus } from 'lucide-react';
import { AddProductModal } from './AddProductModal';

interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>(
    'all'
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search products..."
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="Training Jumps">Training Jumps</option>
          <option value="Training Stands">Training Stands</option>
          <option value="Tournament Jumps">Tournament Jumps</option>
          <option value="Tournament Stands">Tournament Stands</option>
          <option value="Fillers">Fillers</option>
          <option value="Planks">Planks</option>
          <option value="Accessories">Accessories</option>
          <option value="Packages">Packages</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelect}
          />
        ))}
      </div>

      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}