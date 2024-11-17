import { useState } from 'react';
import { motion } from 'framer-motion';
import { Deal, PipelineStage } from '../types';
import { useStore } from '../store/useStore';
import { AddDealModal } from './AddDealModal';

const stages: { id: PipelineStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'contact_made', label: 'Contact Made' },
  { id: 'proposal_sent', label: 'Proposal Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Won' },
  { id: 'closed_lost', label: 'Lost' },
];

interface DealCardProps {
  deal: Deal;
}

function DealCard({ deal }: DealCardProps) {
  const updateDealStage = useStore((state) => state.updateDealStage);
  const updateDeal = useStore((state) => state.updateDeal);
  const deleteDeal = useStore((state) => state.deleteDeal);
  const clients = useStore((state) => state.clients);
  const client = clients.find((c) => c.id === deal.clientId);

  const handleDragEnd = (event: any, info: any) => {
    const stageWidth = window.innerWidth / stages.length;
    const dragDistance = info.offset.x;
    const stagesMoved = Math.round(dragDistance / stageWidth);
    const currentStageIndex = stages.findIndex((s) => s.id === deal.stage);
    const newStageIndex = Math.max(0, Math.min(currentStageIndex + stagesMoved, stages.length - 1));
    const newStage = stages[newStageIndex].id;
    
    if (newStage !== deal.stage) {
      updateDealStage(deal.id, newStage);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => handleDragEnd(e, info)}
      className="bg-white p-4 rounded-lg shadow-sm mb-2 cursor-move group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{client?.name}</h3>
          <p className="text-sm text-gray-500">${deal.value.toFixed(2)}</p>
          {deal.notes && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{deal.notes}</p>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => deleteDeal(deal.id)}
            className="text-red-600 hover:text-red-800 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Last updated: {new Date(deal.updatedAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}

export function Pipeline() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const deals = useStore((state) => state.deals);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="bg-gray-50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">{stage.label}</h2>
              <span className="text-sm text-gray-500">
                {deals.filter((deal) => deal.stage === stage.id).length}
              </span>
            </div>
            {deals
              .filter((deal) => deal.stage === stage.id)
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
          </div>
        ))}
      </div>

      <AddDealModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
