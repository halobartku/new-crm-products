import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '../types';
import { useStore } from '../store/useStore';
import { AddClientModal } from './AddClientModal';
import { EditClientModal } from './EditClientModal';
import { ClientDetailsModal } from './ClientDetailsModal';
import { Trash2, Edit, Search, UserPlus, Building2, Mail, Phone, Tag, MoreVertical, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredClients = clients.filter(
    client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (newClient: Client) => {
    addClient({ ...newClient, createdAt: new Date() });
    toast.success('Client added successfully');
    setIsAddModalOpen(false);
  };

  const handleEditClient = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient);
    toast.success('Client updated successfully');
    setIsEditModalOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId);
      toast.success('Client deleted successfully');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, company, or phone..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={20} />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-lg text-gray-900">{client.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      client.type === 'b2b' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {client.type.toUpperCase()}
                    </span>
                  </div>
                  {client.company && (
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Building2 size={14} />
                      <span>{client.company}</span>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={16} className="text-gray-500" />
                  </button>
                  {activeMenu === client.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsDetailsModalOpen(true);
                          setActiveMenu(null);
                        }}
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditModalOpen(true);
                          setActiveMenu(null);
                        }}
                      >
                        <Edit size={14} />
                        Edit Client
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                          handleDeleteClient(client.id);
                          setActiveMenu(null);
                        }}
                      >
                        <Trash2 size={14} />
                        Delete Client
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  <a href={`mailto:${client.email}`} className="text-sm hover:text-indigo-600 truncate">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <a href={`tel:${client.phone}`} className="text-sm hover:text-indigo-600">
                    {client.phone}
                  </a>
                </div>
              </div>

              {client.vatNumber && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Tag size={14} className="mr-2" />
                    VAT: {client.vatNumber}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddClientModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddClient}
          />
        )}

        {isEditModalOpen && selectedClient && (
          <EditClientModal
            client={selectedClient}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedClient(null);
            }}
            onEdit={handleEditClient}
          />
        )}

        {isDetailsModalOpen && selectedClient && (
          <ClientDetailsModal
            client={selectedClient}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedClient(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
