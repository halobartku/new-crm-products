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
  updateDealStage: (dealId: string, stage: PipelineStage) => void;
}

export const useStore = create<Store>((set) => ({
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
  updateDealStage: (dealId, stage) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === dealId
          ? { ...deal, stage, updatedAt: new Date() }
          : deal
      ),
    })),
}));