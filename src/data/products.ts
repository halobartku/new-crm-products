import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const products: Product[] = [
  {
    id: uuidv4(),
    name: 'Professional Training Jump Set',
    description: 'Complete set of training jumps with adjustable heights and safety features',
    price: 1299.99,
    b2bPrice: 999.99,
    image: 'https://images.unsplash.com/photo-1505246170520-1c003eda7abb?auto=format&fit=crop&q=80&w=1000',
    category: 'Training Jumps',
    sku: 'TJ-001',
    stock: 15
  },
  {
    id: uuidv4(),
    name: 'Competition Stand Pair',
    description: 'Professional-grade aluminum stands for tournament use',
    price: 799.99,
    b2bPrice: 599.99,
    image: 'https://images.unsplash.com/photo-1551524164-687a55dd1126?auto=format&fit=crop&q=80&w=1000',
    category: 'Tournament Stands',
    sku: 'TS-002',
    stock: 20
  },
  {
    id: uuidv4(),
    name: 'Decorative Plank Set',
    description: 'Set of 5 painted wooden planks with customizable designs',
    price: 299.99,
    b2bPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1000',
    category: 'Planks',
    sku: 'PL-003',
    stock: 30
  }
];