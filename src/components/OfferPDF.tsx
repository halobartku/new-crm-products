import { useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Client } from '../types';
import { FileDown } from 'lucide-react';

interface SelectedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  b2bPrice: number;
  image: string;
  category: string;
  sku: string;
  stock: number;
  discountRate: number;
  quantity: number;
}

interface OfferPDFProps {
  products: SelectedProduct[];
  customerName: string;
  total: number;
  subtotal: number;
  discount: number;
  client: Client;
}

export function OfferPDF({ products, customerName, total, subtotal, discount, client }: OfferPDFProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`offer_${customerName.replace(/\s+/g, '_')}.pdf`);
  };

  const calculateItemTotal = (product: SelectedProduct) => {
    const basePrice = client.type === 'b2b' ? product.b2bPrice : product.price;
    return basePrice * product.quantity * (1 - product.discountRate / 100);
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        className="mb-6 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <FileDown size={20} />
        Download PDF
      </button>

      <div ref={pdfRef} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Offer</h1>
          <div className="space-y-1">
            <p className="text-gray-600">Prepared for: {customerName}</p>
            {client.company && <p className="text-gray-600">Company: {client.company}</p>}
            {client.vatNumber && <p className="text-gray-600">VAT: {client.vatNumber}</p>}
          </div>
        </div>

        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="flex gap-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Base Price: ${(client.type === 'b2b' ? product.b2bPrice : product.price).toFixed(2)}
                  </p>
                  {product.discountRate > 0 && (
                    <p className="text-sm text-green-600">
                      Discount: {product.discountRate}%
                    </p>
                  )}
                  <p className="text-lg font-medium text-indigo-600">
                    Total: ${calculateItemTotal(product).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Total Savings:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}