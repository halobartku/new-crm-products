// src/components/AddClientModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Client, ClientType } from "../types";
import { v4 as uuidv4 } from "uuid";

interface AddClientModalProps {
  onClose: () => void;
  onAdd: (client: Client) => void;
}

export function AddClientModal({ onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "direct" as ClientType,
    company: "",
    vatNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Client = {
      id: uuidv4(),
      ...formData,
    };
    onAdd(newClient);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Client</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Type
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as ClientType })
              }
            >
              <option value="direct">Direct</option>
              <option value="b2b">B2B</option>
            </select>
          </div>

          {formData.type === "b2b" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VAT Number
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.vatNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, vatNumber: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Client
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
