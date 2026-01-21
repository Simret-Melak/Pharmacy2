import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/ui-custom/DataTable';
import SearchInput from '@/components/ui-custom/SearchInput';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
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
  UserCog, 
  Plus, 
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

const mockPharmacists = [
  { id: '1', full_name: 'Dr. Sarah Wilson', email: 'sarah.wilson@medicare.com', phone: '+1 (555) 111-2222', license_number: 'RPH-12345', pharmacy_name: 'MediCare Central', status: 'Active' },
  { id: '2', full_name: 'Dr. Michael Chen', email: 'michael.chen@medicare.com', phone: '+1 (555) 222-3333', license_number: 'RPH-23456', pharmacy_name: 'HealthFirst Pharmacy', status: 'Active' },
  { id: '3', full_name: 'Dr. Emily Rodriguez', email: 'emily.rodriguez@medicare.com', phone: '+1 (555) 333-4444', license_number: 'RPH-34567', pharmacy_name: 'CareWell Drugs', status: 'Active' },
  { id: '4', full_name: 'Dr. James Thompson', email: 'james.thompson@medicare.com', phone: '+1 (555) 444-5555', license_number: 'RPH-45678', pharmacy_name: 'QuickMeds Express', status: 'Inactive' },
  { id: '5', full_name: 'Dr. Lisa Martinez', email: 'lisa.martinez@medicare.com', phone: '+1 (555) 555-6666', license_number: 'RPH-56789', pharmacy_name: 'Family Pharmacy', status: 'Active' },
];

const pharmacies = ['All Pharmacies', 'MediCare Central', 'HealthFirst Pharmacy', 'CareWell Drugs', 'QuickMeds Express', 'Family Pharmacy'];

export default function AdminPharmacists() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pharmacyFilter, setPharmacyFilter] = useState('All Pharmacies');

  const filteredPharmacists = mockPharmacists.filter(pharmacist => {
    const matchesSearch = pharmacist.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacist.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pharmacist.status === statusFilter;
    const matchesPharmacy = pharmacyFilter === 'All Pharmacies' || pharmacist.pharmacy_name === pharmacyFilter;
    return matchesSearch && matchesStatus && matchesPharmacy;
  });

  const columns = [
    {
      header: 'Pharmacist',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <UserCog className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.full_name}</p>
            <p className="text-sm text-slate-500">{row.license_number}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      render: (row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <Mail className="h-3 w-3" />
            {row.email}
          </div>
          <div className="flex items-center gap-1 text-slate-500 mt-1">
            <Phone className="h-3 w-3" />
            {row.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Pharmacy',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span className="text-slate-900">{row.pharmacy_name}</span>
        </div>
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
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <AdminLayout title="Pharmacists Management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pharmacists', value: mockPharmacists.length, color: 'text-purple-600' },
          { label: 'Active', value: mockPharmacists.filter(p => p.status === 'Active').length, color: 'text-emerald-600' },
          { label: 'Inactive', value: mockPharmacists.filter(p => p.status === 'Inactive').length, color: 'text-slate-600' },
          { label: 'Pharmacies Covered', value: new Set(mockPharmacists.map(p => p.pharmacy_name)).size, color: 'text-blue-600' },
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
            placeholder="Search pharmacists..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select value={pharmacyFilter} onValueChange={setPharmacyFilter}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pharmacies.map(pharmacy => (
                  <SelectItem key={pharmacy} value={pharmacy}>{pharmacy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Link to={createPageUrl('AdminAddPharmacist')}>
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                Add Pharmacist
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredPharmacists}
        emptyMessage="No pharmacists found"
      />
    </AdminLayout>
  );
}
