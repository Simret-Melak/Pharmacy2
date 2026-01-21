import { useState } from 'react';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  User,
  Calendar,
  ShoppingCart,
  Package,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  MoreVertical,
  Eye,
  History,
  FileText,
  Activity,
  Star
} from 'lucide-react';

const mockCustomers = [
  {
    id: '1',
    full_name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 111-2222',
    address: '123 Health St, New York, NY 10001',
    join_date: '2023-06-15',
    total_orders: 12,
    total_spent: 485.76,
    status: 'Active',
    last_order: '2024-01-18'
  },
  {
    id: '2',
    full_name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 222-3333',
    address: '456 Wellness Ave, Brooklyn, NY 11201',
    join_date: '2023-08-22',
    total_orders: 8,
    total_spent: 324.50,
    status: 'Active',
    last_order: '2024-01-18'
  },
  {
    id: '3',
    full_name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 333-4444',
    address: '789 Care Blvd, Queens, NY 11375',
    join_date: '2023-11-05',
    total_orders: 5,
    total_spent: 156.99,
    status: 'Active',
    last_order: '2024-01-17'
  },
  {
    id: '4',
    full_name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 444-5555',
    address: '321 Medicine Ln, Bronx, NY 10451',
    join_date: '2023-04-30',
    total_orders: 23,
    total_spent: 987.45,
    status: 'Inactive',
    last_order: '2023-12-20'
  },
  {
    id: '5',
    full_name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1 (555) 555-6666',
    address: '654 Pharmacy Rd, Staten Island, NY 10301',
    join_date: '2023-09-12',
    total_orders: 15,
    total_spent: 632.10,
    status: 'Active',
    last_order: '2024-01-16'
  },
];

const mockPurchaseHistory = [
  {
    id: '1',
    customerId: '1',
    orders: [
      { id: 'ORD-2024-001', date: '2024-01-18', items: 3, amount: 45.99, status: 'Completed' },
      { id: 'ORD-2023-012', date: '2023-12-15', items: 2, amount: 32.50, status: 'Completed' },
      { id: 'ORD-2023-011', date: '2023-11-28', items: 1, amount: 24.99, status: 'Completed' },
    ],
    medications: [
      { name: 'Vitamin D3 5000 IU', frequency: 'Monthly', last_purchase: '2024-01-18' },
      { name: 'Ibuprofen 400mg', frequency: 'As needed', last_purchase: '2024-01-18' },
      { name: 'Omega-3 Fish Oil', frequency: 'Monthly', last_purchase: '2023-12-15' },
    ]
  }
];

export default function PharmacistCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const columns = [
    {
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{row.full_name}</p>
            <p className="text-sm text-slate-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      render: (row) => (
        <div className="text-sm">
          <p className="text-slate-600">{row.phone}</p>
          <p className="text-slate-500 truncate max-w-[200px]">{row.address}</p>
        </div>
      )
    },
    {
      header: 'Join Date',
      render: (row) => (
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <Calendar className="h-4 w-4 text-slate-400" />
          {new Date(row.join_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      )
    },
    {
      header: 'Orders',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-slate-400" />
            <span className="font-medium text-slate-900">{row.total_orders}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">${row.total_spent.toFixed(2)}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge className={`${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-0`}>
          {row.status}
        </Badge>
      )
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
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openDetail(row)}>
              <History className="h-4 w-4 mr-2" />
              Purchase History
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <PharmacistLayout title="Customers Management">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: mockCustomers.length, color: 'text-purple-600' },
          { label: 'Active Customers', value: mockCustomers.filter(c => c.status === 'Active').length, color: 'text-emerald-600' },
          { label: 'Total Orders', value: mockCustomers.reduce((sum, c) => sum + c.total_orders, 0), color: 'text-blue-600' },
          { label: 'Total Revenue', value: `$${mockCustomers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(0)}`, color: 'text-amber-600' },
          { label: 'Avg. Orders/Customer', value: (mockCustomers.reduce((sum, c) => sum + c.total_orders, 0) / mockCustomers.length).toFixed(1), color: 'text-cyan-600' },
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
            placeholder="Search customers by name or email..."
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
              Export Customers
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredCustomers}
        emptyMessage="No customers found"
      />

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              View customer details, purchase history, and activity
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile" className="rounded-lg">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg">
                  <History className="h-4 w-4 mr-2" />
                  Purchase History
                </TabsTrigger>
                <TabsTrigger value="medications" className="rounded-lg">
                  <Package className="h-4 w-4 mr-2" />
                  Medications
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.full_name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={`${selectedCustomer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-0`}>
                        {selectedCustomer.status} Customer
                      </Badge>
                      <span className="text-sm text-slate-500">
                        Member since {new Date(selectedCustomer.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                        <span className="text-slate-600">{selectedCustomer.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Purchase Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedCustomer.total_orders}</p>
                        <p className="text-sm text-slate-500">Total Orders</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">${selectedCustomer.total_spent.toFixed(2)}</p>
                        <p className="text-sm text-slate-500">Total Spent</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      Last order: {new Date(selectedCustomer.last_order).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Purchase History Tab */}
              <TabsContent value="history" className="space-y-4">
                <h4 className="font-medium text-slate-900">Recent Orders</h4>
                {mockPurchaseHistory
                  .find(h => h.customerId === selectedCustomer.id)
                  ?.orders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-900">{order.id}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} • {order.items} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${order.amount.toFixed(2)}</p>
                        <Badge className={`${
                          order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        } border-0`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-slate-600">Average Order Value</span>
                  <span className="font-semibold text-slate-900">$40.48</span>
                </div>
              </TabsContent>

              {/* Medications Tab */}
              <TabsContent value="medications" className="space-y-4">
                <h4 className="font-medium text-slate-900">Frequently Purchased Medications</h4>
                {mockPurchaseHistory
                  .find(h => h.customerId === selectedCustomer.id)
                  ?.medications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{med.name}</p>
                          <p className="text-sm text-slate-500">Frequency: {med.frequency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Last purchased</p>
                        <p className="font-medium text-slate-900">
                          {new Date(med.last_purchase).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                
                <div className="pt-4 border-t border-slate-100">
                  <h5 className="font-medium text-slate-900 mb-3">Health Notes</h5>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Note:</span> Customer has recurring prescription for Vitamin D3. 
                      Next refill due in 2 weeks.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" className="rounded-xl">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
              <FileText className="h-4 w-4 mr-2" />
              View Full History
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PharmacistLayout>
  );
}