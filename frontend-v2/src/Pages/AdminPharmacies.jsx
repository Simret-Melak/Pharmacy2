import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  Plus, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  Pill,
  BarChart3
} from 'lucide-react';

const mockPharmacies = [
  { id: '1', name: 'MediCare Central', address: '123 Health St, New York, NY', city: 'New York', phone: '+1 (555) 123-4567', email: 'central@medicare.com', status: 'Active', pharmacist_count: 5, medication_count: 1200, total_orders: 4532 },
  { id: '2', name: 'HealthFirst Pharmacy', address: '456 Wellness Ave, Brooklyn, NY', city: 'Brooklyn', phone: '+1 (555) 234-5678', email: 'info@healthfirst.com', status: 'Active', pharmacist_count: 3, medication_count: 890, total_orders: 2341 },
  { id: '3', name: 'CareWell Drugs', address: '789 Care Blvd, Queens, NY', city: 'Queens', phone: '+1 (555) 345-6789', email: 'contact@carewell.com', status: 'Active', pharmacist_count: 4, medication_count: 1050, total_orders: 3210 },
  { id: '4', name: 'QuickMeds Express', address: '321 Fast Ln, Bronx, NY', city: 'Bronx', phone: '+1 (555) 456-7890', email: 'support@quickmeds.com', status: 'Inactive', pharmacist_count: 2, medication_count: 650, total_orders: 1234 },
  { id: '5', name: 'Family Pharmacy', address: '654 Home St, Staten Island, NY', city: 'Staten Island', phone: '+1 (555) 567-8901', email: 'hello@familypharm.com', status: 'Active', pharmacist_count: 3, medication_count: 780, total_orders: 1876 },
];

export default function AdminPharmacies() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPharmacies = mockPharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pharmacy.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewStats = (id) => {
    navigate(`/admin/pharmacies/stats/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/pharmacies/edit/${id}`);
  };

  const columns = [
    {
      header: 'Pharmacy',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.name}</p>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3 w-3" />
              {row.city}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      render: (row) => (
        <div className="text-sm">
          <p className="text-slate-900">{row.phone}</p>
          <p className="text-slate-500">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Pharmacists',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900">{row.pharmacist_count}</span>
        </div>
      )
    },
    {
      header: 'Medications',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Pill className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900">{row.medication_count.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Orders',
      render: (row) => (
        <span className="font-medium text-slate-900">{row.total_orders.toLocaleString()}</span>
      )
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />
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
            <DropdownMenuItem onClick={() => handleViewStats(row.id)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Stats
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
    <AdminLayout title="Pharmacies Management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pharmacies', value: mockPharmacies.length, color: 'text-purple-600' },
          { label: 'Active', value: mockPharmacies.filter(p => p.status === 'Active').length, color: 'text-emerald-600' },
          { label: 'Total Pharmacists', value: mockPharmacies.reduce((sum, p) => sum + p.pharmacist_count, 0), color: 'text-blue-600' },
          { label: 'Total Medications', value: mockPharmacies.reduce((sum, p) => sum + p.medication_count, 0).toLocaleString(), color: 'text-amber-600' },
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
            placeholder="Search pharmacies..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Link to={createPageUrl('AdminAddPharmacy')}>
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Pharmacy
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredPharmacies}
        emptyMessage="No pharmacies found"
      />
    </AdminLayout>
  );
}
