import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { Trash2, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';
import { OfferPDF } from './OfferPDF';

interface OfferBuilderProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
}

export function OfferBuilder({ selectedProducts, onRemoveProduct }: OfferBuilderProps) {
  const [discountRate, setDiscountRate] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [showPDF, setShowPDF] = useState(false);

  const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discount = (subtotal * discountRate) / 100;
  const total = subtotal - discount;

  const handleCreateOffer = () => {
    if (!customerName) {
      toast.error('Please enter a customer name');
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    
    setShowPDF(true);
    toast.success('Offer created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Offer</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter customer name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Products
          </label>
          <AnimatePresence>
            {selectedProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => onRemoveProduct(product.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountRate}
            onChange={(e) => setDiscountRate(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleCreateOffer}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Calculator size={20} />
          Create Offer
        </button>
      </div>

      {showPDF && (
        <OfferPDF
          products={selectedProducts}
          customerName={customerName}
          total={total}
          subtotal={subtotal}
          discount={discount}
          discountRate={discountRate}
        />
      )}
    </div>
  );
}