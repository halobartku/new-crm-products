import { create } from 'zustand';
import { Product, Client, Deal, PipelineStage } from '../types';

interface Store {
  products: Product[];
  clients: Client[];
  deals: Deal[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addClient: (client: Client) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  updateDealStage: (dealId: string, stage: PipelineStage) => void;
  getDealsByStage: (stage: PipelineStage) => Deal[];
}

export const useStore = create<Store>((set, get) => ({
  products: [],
  clients: [],
  deals: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  addDeal: (deal) =>
    set((state) => ({ deals: [...state.deals, deal] })),
  updateDeal: (id, dealUpdate) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id
          ? { ...deal, ...dealUpdate, updatedAt: new Date() }
          : deal
      ),
    })),
  deleteDeal: (id) =>
    set((state) => ({
      deals: state.deals.filter((deal) => deal.id !== id),
    })),
  updateDealStage: (dealId, stage) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === dealId
          ? { ...deal, stage, updatedAt: new Date() }
          : deal
      ),
    })),
  getDealsByStage: (stage) => {
    const state = get();
    return state.deals.filter((deal) => deal.stage === stage);
  },
}));
