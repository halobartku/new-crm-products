import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ProductTable } from "./components/ProductTable";
import { ProductGrid } from "./components/ProductGrid";
import { Pipeline } from "./components/Pipeline";
import { OfferBuilder } from "./components/OfferBuilder";
import { ClientsPage } from "./components/ClientsPage";
import { useStore } from "./store/useStore";
import { Package, Users, PieChart, Grid, LayoutList } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Product } from "./types";
import { LoginPage } from "./components/LoginPage";
import { ErrorBoundary } from "./components/ErrorBoundary";

type Tab = "products" | "pipeline" | "clients";
type ViewMode = "grid" | "table";

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for existing auth token in localStorage
    const token = localStorage.getItem('auth_token');
    return !!token;
  });
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { products, deals } = useStore();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleLogin = (token: string) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
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
            <div className="flex items-center gap-6">
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
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
              {activeTab === "clients" && <ClientsPage />}
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
