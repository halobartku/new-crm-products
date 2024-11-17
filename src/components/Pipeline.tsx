import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Deal, PipelineStage } from '../types';
import { useStore } from '../store/useStore';
import { AddDealModal } from './AddDealModal';
import { DollarSign, Calendar, FileText, User, MoreVertical } from 'lucide-react';

const stages: { id: PipelineStage; label: string; color: string }[] = [
  { id: 'lead', label: 'Lead', color: 'bg-gray-50 hover:bg-gray-100' },
  { id: 'contact_made', label: 'Contact Made', color: 'bg-blue-50 hover:bg-blue-100' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-50 hover:bg-purple-100' },
  { id: 'closed_won', label: 'Won', color: 'bg-green-50 hover:bg-green-100' },
  { id: 'closed_lost', label: 'Lost', color: 'bg-red-50 hover:bg-red-100' },
];

interface DealCardProps {
  deal: Deal;
  index: number;
}

function DealCard({ deal, index }: DealCardProps) {
  const clients = useStore((state) => state.clients);
  const client = clients.find((c) => c.id === deal.clientId);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg shadow-sm mb-3 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 ring-opacity-50' : 'hover:shadow-md'
          } transition-all duration-200`}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                  {client?.name}
                </h3>
                <div className="flex items-center gap-2">
                  <DollarSign className="text-indigo-500" size={16} />
                  <span className="text-sm font-medium text-gray-900">
                    ${deal.value.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        // Add edit functionality
                      }}
                    >
                      Edit Deal
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        // Add delete functionality
                      }}
                    >
                      Delete Deal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {deal.notes && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{deal.notes}</p>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(deal.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>{deal.products.length} products</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {deal.products.slice(0, 2).map((product, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                >
                  {product.quantity}x Product
                </span>
              ))}
              {deal.products.length > 2 && (
                <span className="text-gray-500">
                  +{deal.products.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function Pipeline() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { deals, updateDealStage } = useStore();

  const getStageTotal = (stageId: PipelineStage) => {
    return deals
      .filter((deal) => deal.stage === stageId)
      .reduce((sum, deal) => sum + deal.value, 0);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const deal = deals.find(d => d.id === draggableId);
    if (deal && destination.droppableId !== deal.stage) {
      updateDealStage(draggableId, destination.droppableId as PipelineStage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Lead
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage.id)
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

            return (
              <div key={stage.id} className={`${stage.color} rounded-lg transition-colors`}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-gray-900">{stage.label}</h2>
                    <span className="text-sm font-medium text-gray-700 bg-white bg-opacity-50 px-2 py-1 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    ${getStageTotal(stage.id).toLocaleString()}
                  </div>

                  <Droppable droppableId={stage.id}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors rounded-lg ${
                          snapshot.isDraggingOver ? 'bg-indigo-50 ring-2 ring-indigo-200' : ''
                        }`}
                      >
                        <AnimatePresence>
                          {stageDeals.map((deal, index) => (
                            <DealCard key={deal.id} deal={deal} index={index} />
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddDealModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
