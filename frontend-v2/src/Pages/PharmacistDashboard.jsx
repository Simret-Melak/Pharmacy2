import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import StatCard from '@/components/ui-custom/StatCard';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, 
  FileText, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';

const mockStats = {
  totalMedications: 1247,
  pendingPrescriptions: 8,
  activeOrders: 23,
  todayRevenue: 2847.50
};

const mockRecentOrders = [
  { id: 'ORD-001', customer: 'John Smith', items: 3, total: 45.99, status: 'Pending', time: '5 min ago' },
  { id: 'ORD-002', customer: 'Emily Davis', items: 1, total: 23.50, status: 'Processing', time: '15 min ago' },
  { id: 'ORD-003', customer: 'Michael Brown', items: 5, total: 89.99, status: 'Ready', time: '30 min ago' },
  { id: 'ORD-004', customer: 'Sarah Wilson', items: 2, total: 34.00, status: 'Completed', time: '1 hour ago' },
];

const mockPendingPrescriptions = [
  { id: '1', patient: 'Alice Johnson', medication: 'Amoxicillin 500mg', time: '10 min ago' },
  { id: '2', patient: 'Bob Williams', medication: 'Metformin 850mg', time: '25 min ago' },
  { id: '3', patient: 'Carol Davis', medication: 'Atorvastatin 40mg', time: '45 min ago' },
];

const mockLowStockItems = [
  { id: '1', name: 'Ibuprofen 400mg', stock: 12, threshold: 50 },
  { id: '2', name: 'Vitamin D3 5000 IU', stock: 8, threshold: 30 },
  { id: '3', name: 'Omeprazole 20mg', stock: 15, threshold: 40 },
];

export default function PharmacistDashboard() {
  return (
    <PharmacistLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Medications"
          value={mockStats.totalMedications.toLocaleString()}
          icon={Pill}
          trend="+12%"
          trendUp={true}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pending Prescriptions"
          value={mockStats.pendingPrescriptions}
          icon={FileText}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Active Orders"
          value={mockStats.activeOrders}
          icon={ShoppingCart}
          trend="+5%"
          trendUp={true}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${mockStats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+18%"
          trendUp={true}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="font-semibold text-lg text-slate-900">Recent Orders</h2>
            <Link to={createPageUrl('PharmacistOrders')}>
              <Button variant="ghost" size="sm" className="text-emerald-600">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {mockRecentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.customer} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${order.total.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={order.status} />
                      <span className="text-xs text-slate-400">{order.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Pending Prescriptions */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Pending Prescriptions</h3>
              <Badge className="bg-amber-100 text-amber-700">{mockPendingPrescriptions.length}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {mockPendingPrescriptions.map((rx) => (
                <div key={rx.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{rx.patient}</p>
                      <p className="text-xs text-slate-500 truncate">{rx.medication}</p>
                    </div>
                    <span className="text-xs text-slate-400">{rx.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link to={createPageUrl('PharmacistPrescriptions')}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  Review All
                </Button>
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Low Stock Alert</h3>
              <Badge className="bg-rose-100 text-rose-700">{mockLowStockItems.length}</Badge>
            </div>
            <div className="divide-y divide-slate-100">
              {mockLowStockItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500">Threshold: {item.threshold}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                      {item.stock} left
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link to={createPageUrl('PharmacistInventory')}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  Manage Inventory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Chart Placeholder */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg text-slate-900">Sales Overview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-lg">Daily</Button>
            <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700">Weekly</Button>
            <Button variant="outline" size="sm" className="rounded-lg">Monthly</Button>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-500">Sales chart visualization</p>
            <p className="text-sm text-slate-400">Integration with recharts available</p>
          </div>
        </div>
      </div>
    </PharmacistLayout>
  );
}