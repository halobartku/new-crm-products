import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductTable } from "./components/ProductTable";
import { ProductGrid } from "./components/ProductGrid";
import { Pipeline } from "./components/Pipeline";
import { OfferBuilder } from "./components/OfferBuilder";
import { useStore } from "./store/useStore";
import { Package, Users, PieChart, Grid, LayoutList } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Product } from "./types";
import { LoginPage } from "./components/LoginPage";

type Tab = "products" | "pipeline" | "clients";
type ViewMode = "grid" | "table";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { products, deals } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={32} className="text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">Showjumps CRM</h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "products"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Package size={20} />
                Products
              </button>
              <button
                onClick={() => setActiveTab("pipeline")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "pipeline"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <PieChart size={20} />
                Pipeline
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeTab === "clients"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users size={20} />
                Clients
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-lg ${
                    viewMode === "table"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <LayoutList size={20} />
                </button>
              </div>

              <div className="flex gap-6">
                <div className={viewMode === "grid" ? "flex-grow" : "w-full"}>
                  {viewMode === "grid" ? (
                    <ProductGrid
                      products={products}
                      onSelect={handleProductSelect}
                    />
                  ) : (
                    <ProductTable products={products} />
                  )}
                </div>
                {viewMode === "grid" && (
                  <div className="w-96">
                    <div className="sticky top-6">
                      <OfferBuilder
                        selectedProducts={selectedProducts}
                        onRemoveProduct={handleProductRemove}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "pipeline" && <Pipeline deals={deals} />}
          {activeTab === "clients" && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Clients</h2>
              {/* Client management component will go here */}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default App;