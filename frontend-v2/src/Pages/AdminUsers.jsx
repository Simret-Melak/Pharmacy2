import { useState } from 'react';
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
  Users, 
  MoreVertical,
  Eye,
  Ban,
  Mail,
  Calendar,
  ShoppingCart
} from 'lucide-react';

const mockUsers = [
  { id: '1', full_name: 'John Smith', email: 'john.smith@example.com', phone: '+1 (555) 111-2222', created_date: '2024-01-15', total_orders: 12, status: 'Active' },
  { id: '2', full_name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1 (555) 222-3333', created_date: '2024-01-10', total_orders: 8, status: 'Active' },
  { id: '3', full_name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+1 (555) 333-4444', created_date: '2024-01-05', total_orders: 23, status: 'Active' },
  { id: '4', full_name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '+1 (555) 444-5555', created_date: '2023-12-20', total_orders: 5, status: 'Inactive' },
  { id: '5', full_name: 'David Lee', email: 'david.lee@example.com', phone: '+1 (555) 555-6666', created_date: '2023-12-15', total_orders: 15, status: 'Active' },
  { id: '6', full_name: 'Jessica Martinez', email: 'jessica.m@example.com', phone: '+1 (555) 666-7777', created_date: '2023-11-28', total_orders: 32, status: 'Active' },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="font-medium text-slate-600">
              {row.full_name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.full_name}</p>
            <p className="text-sm text-slate-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Phone',
      render: (row) => <span className="text-slate-600">{row.phone}</span>
    },
    {
      header: 'Joined',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          {new Date(row.created_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )
    },
    {
      header: 'Orders',
      render: (row) => (
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-900">{row.total_orders}</span>
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
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">
              <Ban className="h-4 w-4 mr-2" />
              {row.status === 'Active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <AdminLayout title="Users Management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: mockUsers.length, color: 'text-blue-600' },
          { label: 'Active Users', value: mockUsers.filter(u => u.status === 'Active').length, color: 'text-emerald-600' },
          { label: 'Total Orders', value: mockUsers.reduce((sum, u) => sum + u.total_orders, 0), color: 'text-purple-600' },
          { label: 'New This Month', value: mockUsers.filter(u => new Date(u.created_date) > new Date('2024-01-01')).length, color: 'text-amber-600' },
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
            placeholder="Search users by name or email..."
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
            <Button variant="outline" className="rounded-xl">
              Export Users
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredUsers}
        emptyMessage="No users found"
      />
    </AdminLayout>
  );
}
