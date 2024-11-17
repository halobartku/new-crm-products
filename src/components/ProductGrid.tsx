import { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Product, ProductCategory } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';

const columnHelper = createColumnHelper<Product>();

const columns = [
  columnHelper.accessor('sku', {
    header: 'SKU',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Retail Price',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('b2bPrice', {
    header: 'B2B Price',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor('stock', {
    header: 'Stock',
    cell: (info) => info.getValue(),
  }),
];

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
}

export function ProductTable({ products, onEdit }: ProductTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>(
    'all'
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const filteredProducts =
    categoryFilter === 'all'
      ? products
      : products.filter((p) => p.category === categoryFilter);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search products..."
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'all')}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Training Jumps">Training Jumps</option>
            <option value="Training Stands">Training Stands</option>
            <option value="Tournament Jumps">Tournament Jumps</option>
            <option value="Tournament Stands">Tournament Stands</option>
            <option value="Fillers">Fillers</option>
            <option value="Planks">Planks</option>
            <option value="Accessories">Accessories</option>
            <option value="Packages">Packages</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onEdit?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}