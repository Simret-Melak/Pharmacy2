
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ShoppingCart, 
  MoreVertical,
  Eye,
  Building2,
  User,
  Download,
  Filter
} from 'lucide-react';

const mockOrders = [
  { id: 'ORD-2024-001', customer_name: 'John Smith', pharmacy: 'MediCare Central', items: 3, total_amount: 45.99, status: 'Pending', created_date: '2024-01-18T10:30:00Z' },
  { id: 'ORD-2024-002', customer_name: 'Emily Davis', pharmacy: 'HealthFirst Pharmacy', items: 1, total_amount: 23.50, status: 'Processing', created_date: '2024-01-18T09:15:00Z' },
  { id: 'ORD-2024-003', customer_name: 'Michael Brown', pharmacy: 'CareWell Drugs', items: 5, total_amount: 89.99, status: 'Completed', created_date: '2024-01-17T14:00:00Z' },
  { id: 'ORD-2024-004', customer_name: 'Sarah Wilson', pharmacy: 'QuickMeds Express', items: 2, total_amount: 34.00, status: 'Ready', created_date: '2024-01-16T11:30:00Z' },
  { id: 'ORD-2024-005', customer_name: 'David Lee', pharmacy: 'Family Pharmacy', items: 1, total_amount: 67.50, status: 'Cancelled', created_date: '2024-01-15T16:45:00Z' },
  { id: 'ORD-2024-006', customer_name: 'Robert Johnson', pharmacy: 'MediCare Central', items: 4, total_amount: 120.75, status: 'Completed', created_date: '2024-01-14T14:20:00Z' },
  { id: 'ORD-2024-007', customer_name: 'Lisa Anderson', pharmacy: 'HealthFirst Pharmacy', items: 2, total_amount: 56.80, status: 'Processing', created_date: '2024-01-14T11:45:00Z' },
  { id: 'ORD-2024-008', customer_name: 'Thomas Wilson', pharmacy: 'CareWell Drugs', items: 1, total_amount: 32.99, status: 'Pending', created_date: '2024-01-13T16:30:00Z' },
];

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pharmacyFilter, setPharmacyFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPharmacy = pharmacyFilter === 'all' || order.pharmacy === pharmacyFilter;
    
    // Date filtering logic
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.created_date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const last7Days = new Date(today);
      last7Days.setDate(last7Days.getDate() - 7);
      const last30Days = new Date(today);
      last30Days.setDate(last30Days.getDate() - 30);
      
      switch(dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesDate = orderDate.toDateString() === yesterday.toDateString();
          break;
        case 'week':
          matchesDate = orderDate >= last7Days;
          break;
        case 'month':
          matchesDate = orderDate >= last30Days;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPharmacy && matchesDate;
  });

  const columns = [
    {
      header: 'Order',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.id}</p>
          <p className="text-sm text-slate-500">
            {new Date(row.created_date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )
    },
    {
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-400" />
          <span className="text-slate-900">{row.customer_name}</span>
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
      header: 'Items',
      render: (row) => <span className="text-slate-600">{row.items}</span>
    },
    {
      header: 'Total',
      render: (row) => <span className="font-semibold text-slate-900">${row.total_amount.toFixed(2)}</span>
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
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Process Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const totalRevenue = mockOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const averageOrderValue = totalRevenue / mockOrders.length;

  return (
    <AdminLayout title="All Orders">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: mockOrders.length, color: 'text-slate-900' },
          { label: 'Pending', value: mockOrders.filter(o => o.status === 'Pending').length, color: 'text-amber-600' },
          { label: 'Processing', value: mockOrders.filter(o => o.status === 'Processing').length, color: 'text-blue-600' },
          { label: 'Completed', value: mockOrders.filter(o => o.status === 'Completed').length, color: 'text-emerald-600' },
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, color: 'text-purple-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Average Order Value</p>
              <p className="text-2xl font-bold text-slate-900">${averageOrderValue.toFixed(2)}</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pharmacies with Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {new Set(mockOrders.map(o => o.pharmacy)).size}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Items Sold</p>
              <p className="text-2xl font-bold text-slate-900">
                {mockOrders.reduce((sum, o) => sum + o.items, 0)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by order ID or customer name..."
            className="flex-1"
          />
          <div className="flex flex-wrap gap-3">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-36 rounded-xl">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-xl">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable 
        columns={columns} 
        data={filteredOrders}
        emptyMessage="No orders found matching your criteria"
      />

      {/* Summary Footer */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-500 mb-4 md:mb-0">
            Showing {filteredOrders.length} of {mockOrders.length} orders
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-slate-500">Filtered Revenue</p>
              <p className="text-lg font-bold text-purple-600">
                ${filteredOrders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500">Filtered Items</p>
              <p className="text-lg font-bold text-blue-600">
                {filteredOrders.reduce((sum, o) => sum + o.items, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
