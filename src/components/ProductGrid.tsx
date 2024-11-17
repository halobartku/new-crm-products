import React from 'react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function ProductGrid({ products, onSelect }: ProductGridProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onSelect(product)}
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
              <img
                src={product.image || '/api/placeholder/400/320'}
                alt={product.name}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
              />
              {product.stock <= 10 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Low Stock
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                SKU: {product.sku}
              </p>
              
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    B2B: ${product.b2bPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`text-sm ${
                    product.stock > 10 
                      ? 'text-green-600' 
                      : product.stock > 0 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {product.stock > 0 
                      ? `${product.stock} in stock`
                      : 'Out of stock'
                    }
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No products found
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}