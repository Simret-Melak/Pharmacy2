import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import DataTable from '@/components/ui-custom/DataTable';
import SearchInput from '@/components/ui-custom/SearchInput';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Download, 
  Upload,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

const mockMedications = [
  { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.99, stock: 150, prescription_required: true, expiration_date: '2025-06-15' },
  { id: '2', name: 'Vitamin D3 5000 IU', category: 'Vitamins', price: 15.99, stock: 8, prescription_required: false, expiration_date: '2025-12-01' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 8.99, stock: 300, prescription_required: false, expiration_date: '2024-09-30' },
  { id: '4', name: 'Metformin 850mg', category: 'Diabetes', price: 24.99, stock: 75, prescription_required: true, expiration_date: '2025-03-20' },
  { id: '5', name: 'Loratadine 10mg', category: 'Allergy', price: 11.49, stock: 180, prescription_required: false, expiration_date: '2025-08-10' },
  { id: '6', name: 'Omeprazole 20mg', category: 'Digestive', price: 18.99, stock: 15, prescription_required: false, expiration_date: '2024-11-25' },
  { id: '7', name: 'Atorvastatin 40mg', category: 'Heart Health', price: 32.99, stock: 90, prescription_required: true, expiration_date: '2025-07-05' },
  { id: '8', name: 'Cetirizine 10mg', category: 'Allergy', price: 9.99, stock: 250, prescription_required: false, expiration_date: '2025-10-15' },
];

const categories = ['All Categories', 'Antibiotics', 'Vitamins', 'Pain Relief', 'Allergy', 'Diabetes', 'Heart Health', 'Digestive'];

export default function PharmacistInventory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredMedications = mockMedications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || med.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && med.stock < 20) ||
                        (stockFilter === 'normal' && med.stock >= 20);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const columns = [
    {
      header: 'Medication',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100"
              alt={row.name}
              className="h-8 w-8 object-contain rounded"
            />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-sm text-slate-500">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-semibold text-slate-900">${row.price.toFixed(2)}</span>
      )
    },
    {
      header: 'Stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.stock < 20 && <AlertCircle className="h-4 w-4 text-rose-500" />}
          <span className={`font-medium ${row.stock < 20 ? 'text-rose-600' : 'text-slate-900'}`}>
            {row.stock}
          </span>
        </div>
      )
    },
    {
      header: 'Prescription',
      render: (row) => (
        row.prescription_required ? (
          <Badge className="bg-amber-100 text-amber-700 border-0">
            <FileText className="h-3 w-3 mr-1" />
            Required
          </Badge>
        ) : (
          <Badge className="bg-slate-100 text-slate-600 border-0">OTC</Badge>
        )
      )
    },
    {
      header: 'Expiry Date',
      render: (row) => {
        const expDate = new Date(row.expiration_date);
        const isNearExpiry = expDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        return (
          <span className={isNearExpiry ? 'text-amber-600' : 'text-slate-600'}>
            {expDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-rose-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <PharmacistLayout title="Medication Inventory">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: mockMedications.length, color: 'text-blue-600' },
          { label: 'Low Stock', value: mockMedications.filter(m => m.stock < 20).length, color: 'text-rose-600' },
          { label: 'Prescription Only', value: mockMedications.filter(m => m.prescription_required).length, color: 'text-amber-600' },
          { label: 'Categories', value: new Set(mockMedications.map(m => m.category)).size, color: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search medications..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Stock Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-700">{filteredMedications.length}</span> medications
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Link to={createPageUrl('PharmacistAddMedication')}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredMedications}
        emptyMessage="No medications found"
      />
    </PharmacistLayout>
  );
}
