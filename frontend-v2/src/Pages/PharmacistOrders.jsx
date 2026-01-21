import { useState } from 'react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Package, 
  User, 
  MapPin,
  Calendar,
  MoreVertical,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    customer_name: 'John Smith',
    customer_email: 'john@example.com',
    items: [
      { name: 'Vitamin D3 5000 IU', quantity: 2, price: 15.99 },
      { name: 'Ibuprofen 400mg', quantity: 1, price: 8.99 },
    ],
    total_amount: 40.97,
    status: 'Pending',
    created_date: '2024-01-18T10:30:00Z',
    shipping_address: '123 Health St, New York, NY 10001'
  },
  {
    id: 'ORD-2024-002',
    customer_name: 'Emily Davis',
    customer_email: 'emily@example.com',
    items: [
      { name: 'Omega-3 Fish Oil', quantity: 1, price: 24.99 },
    ],
    total_amount: 24.99,
    status: 'Processing',
    created_date: '2024-01-18T09:15:00Z',
    shipping_address: '456 Wellness Ave, Brooklyn, NY 11201'
  },
  {
    id: 'ORD-2024-003',
    customer_name: 'Michael Brown',
    customer_email: 'michael@example.com',
    items: [
      { name: 'Metformin 850mg', quantity: 1, price: 24.99 },
      { name: 'Vitamin B12', quantity: 2, price: 12.99 },
    ],
    total_amount: 50.97,
    status: 'Ready',
    created_date: '2024-01-17T14:00:00Z',
    shipping_address: '789 Care Blvd, Queens, NY 11375'
  },
  {
    id: 'ORD-2024-004',
    customer_name: 'Sarah Wilson',
    customer_email: 'sarah@example.com',
    items: [
      { name: 'Loratadine 10mg', quantity: 1, price: 11.49 },
    ],
    total_amount: 11.49,
    status: 'Completed',
    created_date: '2024-01-16T11:30:00Z',
    shipping_address: '321 Medicine Ln, Bronx, NY 10451'
  },
  {
    id: 'ORD-2024-005',
    customer_name: 'David Lee',
    customer_email: 'david@example.com',
    items: [
      { name: 'Omeprazole 20mg', quantity: 2, price: 18.99 },
    ],
    total_amount: 37.98,
    status: 'Cancelled',
    created_date: '2024-01-15T16:45:00Z',
    shipping_address: '654 Pharmacy Rd, Staten Island, NY 10301'
  },
];

export default function PharmacistOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

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
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="h-4 w-4 text-slate-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.customer_name}</p>
            <p className="text-sm text-slate-500">{row.customer_email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Items',
      render: (row) => (
        <div>
          <p className="text-slate-900">{row.items.length} item(s)</p>
          <p className="text-sm text-slate-500 truncate max-w-[200px]">
            {row.items.map(i => i.name).join(', ')}
          </p>
        </div>
      )
    },
    {
      header: 'Total',
      render: (row) => (
        <span className="font-semibold text-slate-900">${row.total_amount.toFixed(2)}</span>
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
            <DropdownMenuItem onClick={() => openDetail(row)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Clock className="h-4 w-4 mr-2" />
              Mark Processing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Truck className="h-4 w-4 mr-2" />
              Mark Ready
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <PharmacistLayout title="Orders Management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'All Orders', value: mockOrders.length, color: 'text-slate-900' },
          { label: 'Pending', value: mockOrders.filter(o => o.status === 'Pending').length, color: 'text-amber-600' },
          { label: 'Processing', value: mockOrders.filter(o => o.status === 'Processing').length, color: 'text-blue-600' },
          { label: 'Ready', value: mockOrders.filter(o => o.status === 'Ready').length, color: 'text-purple-600' },
          { label: 'Completed', value: mockOrders.filter(o => o.status === 'Completed').length, color: 'text-emerald-600' },
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
            placeholder="Search by order ID or customer..."
            className="flex-1"
          />
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 rounded-xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredOrders}
        emptyMessage="No orders found"
      />

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg text-slate-900">{selectedOrder.id}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(selectedOrder.created_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <StatusBadge status={selectedOrder.status} />
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.customer_email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                  <p className="text-slate-600">{selectedOrder.shipping_address}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <span className="font-medium text-slate-900">Total</span>
                  <span className="text-xl font-bold text-emerald-600">${selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                  Update Status
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl">
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PharmacistLayout>
  );
}
