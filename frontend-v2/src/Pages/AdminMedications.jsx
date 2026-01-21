import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/ui-custom/DataTable';
import SearchInput from '@/components/ui-custom/SearchInput';
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
  Pill, 
  AlertCircle,
  Building2,
  FileText,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const mockMedications = [
  { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.99, stock: 150, prescription_required: true, pharmacy: 'MediCare Central' },
  { id: '2', name: 'Vitamin D3 5000 IU', category: 'Vitamins', price: 15.99, stock: 8, prescription_required: false, pharmacy: 'HealthFirst Pharmacy' },
  { id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 8.99, stock: 300, prescription_required: false, pharmacy: 'CareWell Drugs' },
  { id: '4', name: 'Metformin 850mg', category: 'Diabetes', price: 24.99, stock: 75, prescription_required: true, pharmacy: 'QuickMeds Express' },
  { id: '5', name: 'Loratadine 10mg', category: 'Allergy', price: 11.49, stock: 15, prescription_required: false, pharmacy: 'Family Pharmacy' },
];

export default function AdminMedications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacyFilter, setPharmacyFilter] = useState('all');

  const filteredMedications = mockMedications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPharmacy = pharmacyFilter === 'all' || med.pharmacy === pharmacyFilter;
    return matchesSearch && matchesPharmacy;
  });

  const columns = [
    {
      header: 'Medication',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Pill className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <p className="text-sm text-slate-500">{row.category}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Pharmacy',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span className="text-slate-600">{row.pharmacy}</span>
        </div>
      )
    },
    {
      header: 'Price',
      render: (row) => <span className="font-semibold text-slate-900">${row.price.toFixed(2)}</span>
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
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-rose-600 hover:text-rose-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="System-wide Inventory">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Medications', value: mockMedications.length, color: 'text-purple-600' },
          { label: 'Low Stock Items', value: mockMedications.filter(m => m.stock < 20).length, color: 'text-rose-600' },
          { label: 'Prescription Only', value: mockMedications.filter(m => m.prescription_required).length, color: 'text-amber-600' },
          { label: 'Pharmacies', value: new Set(mockMedications.map(m => m.pharmacy)).size, color: 'text-blue-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
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
            <Select value={pharmacyFilter} onValueChange={setPharmacyFilter}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="All Pharmacies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pharmacies</SelectItem>
                <SelectItem value="MediCare Central">MediCare Central</SelectItem>
                <SelectItem value="HealthFirst Pharmacy">HealthFirst Pharmacy</SelectItem>
                <SelectItem value="CareWell Drugs">CareWell Drugs</SelectItem>
                <SelectItem value="QuickMeds Express">QuickMeds Express</SelectItem>
                <SelectItem value="Family Pharmacy">Family Pharmacy</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/admin/medications/add">
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredMedications}
        emptyMessage="No medications found"
      />
    </AdminLayout>
  );
}
