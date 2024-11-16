import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Client, Deal } from '../types';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDealModal({ isOpen, onClose }: AddDealModalProps) {
  const addDeal = useStore((state) => state.addDeal);
  const clients = useStore((state) => state.clients);
  const [selectedClient, setSelectedClient] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDeal: Deal = {
      id: crypto.randomUUID(),
      clientId: selectedClient,
      products: [],
      stage: 'lead',
      value: parseFloat(value) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      notes,
    };

    addDeal(newDeal);
    onClose();
    setSelectedClient('');
    setValue('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Potential Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder="Enter potential value"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded-md p-2"
              rows={3}
              placeholder="Enter any notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
