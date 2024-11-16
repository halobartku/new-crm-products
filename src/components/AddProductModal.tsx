import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface AddProductModalProps {
  onClose: () => void;
}

export function AddProductModal({ onClose }: AddProductModalProps) {
  const addProduct = useStore((state) => state.addProduct);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    b2bPrice: '',
    image: '',
    category: '' as ProductCategory,
    sku: '',
    stock: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id: uuidv4(),
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      b2bPrice: Number(formData.b2bPrice),
      image: formData.image,
      category: formData.category,
      sku: formData.sku,
      stock: Number(formData.stock)
    };

    addProduct(product);
    toast.success('Product added successfully!');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retail Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                B2B Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.b2bPrice}
                onChange={(e) => setFormData({ ...formData, b2bPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Training Jumps">Training Jumps</option>
                <option value="Training Stands">Training Stands</option>
                <option value="Tournament Jumps">Tournament Jumps</option>
                <option value="Tournament Stands">Tournament Stands</option>
                <option value="Fillers">Fillers</option>
                <option value="Planks">Planks</option>
                <option value="Accessories">Accessories</option>
                <option value="Packages">Packages</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}