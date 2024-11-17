import { create } from "zustand";
import { Product, Client, Deal, PipelineStage } from "../types";

interface Store {
  products: Product[];
  clients: Client[];
  deals: Deal[];
  // Product actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  // Client actions
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  // Deal actions
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, deal: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  updateDealStage: (dealId: string, stage: PipelineStage) => void;
  getDealsByStage: (stage: PipelineStage) => Deal[];
  getDealById: (id: string) => Deal | undefined;
}

// Sample data for initial state
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Professional Training Jump",
    description: "High-quality training jump suitable for professional riders",
    price: 599.99,
    b2bPrice: 479.99,
    image: "/api/placeholder/400/320",
    category: "Training Jumps",
    sku: "TJ-001",
    stock: 15,
  },
  {
    id: "2",
    name: "Competition Stand Set",
    description: "Premium competition stand set with adjustable heights",
    price: 899.99,
    b2bPrice: 719.99,
    image: "/api/placeholder/400/320",
    category: "Tournament Stands",
    sku: "TS-001",
    stock: 8,
  },
  {
    id: "3",
    name: "Decorative Plank Set",
    description: "Set of 3 decorative planks with custom designs",
    price: 299.99,
    b2bPrice: 239.99,
    image: "/api/placeholder/400/320",
    category: "Planks",
    sku: "PL-003",
    stock: 20,
  },
];

const initialClients: Client[] = [
  {
    id: "1",
    name: "Equestrian Center Elite",
    email: "contact@ecelite.com",
    phone: "123-456-7890",
    type: "b2b",
    company: "Equestrian Center Elite LLC",
    vatNumber: "EU123456789",
    createdAt: new Date("2024-01-15"),
    notes: "Premium facility, regular bulk orders",
  },
];

export const useStore = create<Store>((set, get) => ({
  products: initialProducts,
  clients: initialClients,
  deals: [],

  // Product actions
  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...product } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      // Also update deals to remove deleted product
      deals: state.deals.map((deal) => ({
        ...deal,
        products: deal.products.filter((p) => p.productId !== id),
      })),
    })),

  getProductById: (id) => {
    const state = get();
    return state.products.find((product) => product.id === id);
  },

  // Client actions
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),

  updateClient: (id, clientUpdate) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...clientUpdate } : client
      ),
    })),

  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
      deals: state.deals.filter((deal) => deal.clientId !== id),
    })),

  getClientById: (id) => {
    const state = get();
    return state.clients.find((client) => client.id === id);
  },

  // Deal actions
  addDeal: (deal) => set((state) => ({ deals: [...state.deals, deal] })),

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
        deal.id === dealId ? { ...deal, stage, updatedAt: new Date() } : deal
      ),
    })),

  getDealsByStage: (stage) => {
    const state = get();
    return state.deals.filter((deal) => deal.stage === stage);
  },

  getDealById: (id) => {
    const state = get();
    return state.deals.find((deal) => deal.id === id);
  },
}));

// Add persistence middleware if needed
// useStore.persist = create(persist(useStore, { name: 'crm-store' }))

// Add devtools middleware if needed
// useStore.devtools = create(devtools(useStore))

export type { Store };