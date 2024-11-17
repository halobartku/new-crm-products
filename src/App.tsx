import React, { useState } from "react";
import { motion } from "framer-motion";
import { ProductTable } from "./components/ProductTable";
import { ProductGrid } from "./components/ProductGrid";
import { Pipeline } from "./components/Pipeline";
import { OfferBuilder } from "./components/OfferBuilder";
import { useStore } from "./store/useStore";
import {
  Package,
  Users,
  PieChart,
  Grid,
  LayoutList,
  Plus,
  Search,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Product, Client } from "./types";
import toast from "react-hot-toast";
import { AddClientModal } from "./components/AddClientModal";
import { EditClientModal } from "./components/EditClientModal";

type Tab = "products" | "pipeline" | "clients";
type ViewMode = "grid" | "table";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const { products, deals, clients, addClient, updateClient, deleteClient } =
    useStore();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleProductSelect = (product: Product) => {
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const handleAddClient = (client: Client) => {
    addClient(client);
    toast.success("Client added successfully");
    setIsAddClientModalOpen(false);
  };

  const handleEditClient = (client: Client) => {
    updateClient(client.id, client);
    toast.success("Client updated successfully");
    setIsEditClientModalOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      deleteClient(id);
      toast.success("Client deleted successfully");
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
                <button
                  onClick={() => setIsAddClientModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                  <Plus size={20} />
                  Add Client
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
              </div>

              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditClientModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {isAddClientModalOpen && (
        <AddClientModal
          onClose={() => setIsAddClientModalOpen(false)}
          onAdd={handleAddClient}
        />
      )}

      {isEditClientModalOpen && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={() => {
            setIsEditClientModalOpen(false);
            setSelectedClient(null);
          }}
          onEdit={handleEditClient}
        />
      )}
    </div>
  );
}

export default App;