import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Client } from '../types';
import { Trash2, Calculator, User, Building2, Mail, Phone, UserPlus, Percent } from 'lucide-react';
import toast from 'react-hot-toast';
import { OfferPDF } from './OfferPDF';
import { ClientSearchModal } from './ClientSearchModal';

interface SelectedProduct extends Product {
  discountRate: number;
  quantity: number;
}

interface OfferBuilderProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
}

export function OfferBuilder({ selectedProducts, onRemoveProduct }: OfferBuilderProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [products, setProducts] = useState<SelectedProduct[]>(
    selectedProducts.map(p => ({ ...p, discountRate: 0, quantity: 1 }))
  );

  const calculateItemTotal = (product: SelectedProduct) => {
    const basePrice = selectedClient?.type === 'b2b' ? product.b2bPrice : product.price;
    const discountedPrice = basePrice * (1 - product.discountRate / 100);
    return discountedPrice * product.quantity;
  };

  const subtotal = products.reduce((sum, product) => sum + calculateItemTotal(product), 0);
  const totalDiscount = products.reduce((sum, product) => {
    const basePrice = selectedClient?.type === 'b2b' ? product.b2bPrice : product.price;
    return sum + (basePrice * product.quantity * (product.discountRate / 100));
  }, 0);

  const handleDiscountChange = (productId: string, discountRate: number) => {
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, discountRate } : p)
    );
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, quantity } : p)
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    onRemoveProduct(productId);
  };

  const handleCreateOffer = () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }
    if (products.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    
    setShowPDF(true);
    toast.success('Offer created successfully!');
  };

  const discountOptions = Array.from({ length: 21 }, (_, i) => i * 5);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Offer</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client
          </label>
          {selectedClient ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{selectedClient.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      selectedClient.type === 'b2b' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedClient.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2" />
                      {selectedClient.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={14} className="mr-2" />
                      {selectedClient.phone}
                    </div>
                    {selectedClient.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 size={14} className="mr-2" />
                        {selectedClient.company}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowClientSearch(true)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClientSearch(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-500 transition-colors"
            >
              <UserPlus size={20} />
              Select Client
            </button>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Products
          </label>
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 mb-2 bg-gray-50 rounded-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">
                    Base price: ${(selectedClient?.type === 'b2b' ? product.b2bPrice : product.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Qty:</label>
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent size={16} className="text-gray-400" />
                    <select
                      value={product.discountRate}
                      onChange={(e) => handleDiscountChange(product.id, Number(e.target.value))}
                      className="px-2 py-1 border rounded-lg"
                    >
                      {discountOptions.map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}%
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${calculateItemTotal(product).toFixed(2)}
                    </p>
                    {product.discountRate > 0 && (
                      <p className="text-sm text-green-600">
                        Save ${(
                          (selectedClient?.type === 'b2b' ? product.b2bPrice : product.price) *
                          product.quantity *
                          (product.discountRate / 100)
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total Savings:</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800">
            <span>Total:</span>
            <span>${(subtotal - totalDiscount).toFixed(2)}</span>
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

      <AnimatePresence>
        {showClientSearch && (
          <ClientSearchModal
            onClose={() => setShowClientSearch(false)}
            onSelect={setSelectedClient}
          />
        )}
      </AnimatePresence>

      {showPDF && selectedClient && (
        <OfferPDF
          products={products}
          customerName={selectedClient.name}
          total={subtotal - totalDiscount}
          subtotal={subtotal}
          discount={totalDiscount}
          client={selectedClient}
        />
      )}
    </div>
  );
}