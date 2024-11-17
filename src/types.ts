export type ProductCategory =
  | 'Training Jumps'
  | 'Training Stands'
  | 'Tournament Jumps'
  | 'Tournament Stands'
  | 'Fillers'
  | 'Planks'
  | 'Accessories'
  | 'Packages';

export type ClientType = 'b2b' | 'direct';

export type PipelineStage =
  | 'lead'
  | 'contact_made'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  b2bPrice: number;
  image: string;
  category: ProductCategory;
  sku: string;
  stock: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  company?: string;
  vatNumber?: string;
  createdAt: Date;
  notes?: string;
}

export interface Deal {
  id: string;
  clientId: string;
  products: Array<{ productId: string; quantity: number }>;
  stage: PipelineStage;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}
