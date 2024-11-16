import { motion } from 'framer-motion';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onSelect(product)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            Add to Offer
          </button>
        </div>
      </div>
    </motion.div>
  );
}