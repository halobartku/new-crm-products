import { motion } from 'framer-motion';
import { Deal, PipelineStage } from '../types';
import { useStore } from '../store/useStore';

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
  const clients = useStore((state) => state.clients);
  const client = clients.find((c) => c.id === deal.clientId);

  const handleDragEnd = (event: any, stage: PipelineStage) => {
    updateDealStage(deal.id, stage);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={(e) => handleDragEnd(e, deal.stage)}
      className="bg-white p-4 rounded-lg shadow-sm mb-2 cursor-move"
    >
      <h3 className="font-medium text-gray-900">{client?.name}</h3>
      <p className="text-sm text-gray-500">${deal.value.toFixed(2)}</p>
    </motion.div>
  );
}

interface PipelineProps {
  deals: Deal[];
}

export function Pipeline({ deals }: PipelineProps) {
  return (
    <div className="grid grid-cols-6 gap-4 p-4">
      {stages.map((stage) => (
        <div
          key={stage.id}
          className="bg-gray-50 p-4 rounded-lg"
        >
          <h2 className="font-semibold text-gray-700 mb-4">{stage.label}</h2>
          {deals
            .filter((deal) => deal.stage === stage.id)
            .map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
        </div>
      ))}
    </div>
  );
}