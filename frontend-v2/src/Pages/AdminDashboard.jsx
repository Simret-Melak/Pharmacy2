import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/ui-custom/StatCard';
import StatusBadge from '@/components/ui-custom/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  UserCog, 
  Pill,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Activity,
  Clock
} from 'lucide-react';

const mockStats = {
  totalPharmacies: 24,
  totalPharmacists: 86,
  totalMedications: 12470,
  totalUsers: 8543,
  totalOrders: 34521,
  totalRevenue: 1254789.50
};

const recentActivity = [
  { type: 'order', message: 'New order #ORD-2024-001 placed', time: '2 min ago', icon: ShoppingCart },
  { type: 'pharmacy', message: 'HealthFirst Pharmacy added', time: '15 min ago', icon: Building2 },
  { type: 'user', message: 'New user registered: john@example.com', time: '30 min ago', icon: Users },
  { type: 'pharmacist', message: 'Dr. Sarah Wilson approved as pharmacist', time: '1 hour ago', icon: UserCog },
  { type: 'medication', message: 'Low stock alert: Ibuprofen 400mg', time: '2 hours ago', icon: Pill },
];

const topPharmacies = [
  { name: 'MediCare Central', orders: 1234, revenue: 45678.90, status: 'Active' },
  { name: 'HealthFirst Pharmacy', orders: 987, revenue: 34567.80, status: 'Active' },
  { name: 'CareWell Drugs', orders: 876, revenue: 29876.50, status: 'Active' },
  { name: 'QuickMeds Express', orders: 654, revenue: 23456.70, status: 'Active' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Admin Dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin</h1>
        <p className="text-purple-100">Here's what's happening across your pharmacy network today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Pharmacies"
          value={mockStats.totalPharmacies}
          icon={Building2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pharmacists"
          value={mockStats.totalPharmacists}
          icon={UserCog}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Medications"
          value={mockStats.totalMedications.toLocaleString()}
          icon={Pill}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Users"
          value={mockStats.totalUsers.toLocaleString()}
          icon={Users}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Orders"
          value={mockStats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
        />
        <StatCard
          title="Revenue"
          value={`$${(mockStats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Revenue Overview</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">Daily</Button>
              <Button size="sm" className="rounded-lg bg-purple-600 hover:bg-purple-700">Weekly</Button>
              <Button variant="outline" size="sm" className="rounded-lg">Monthly</Button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-500">System-wide revenue chart</p>
              <p className="text-sm text-slate-400">Aggregate data from all pharmacies</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-lg text-slate-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <activity.icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Pharmacies */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-semibold text-lg text-slate-900">Top Performing Pharmacies</h2>
          <Link to={createPageUrl('AdminPharmacies')}>
            <Button variant="ghost" size="sm" className="text-purple-600">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Pharmacy</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Total Orders</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Revenue</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topPharmacies.map((pharmacy, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-slate-900">{pharmacy.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{pharmacy.orders.toLocaleString()}</td>
                  <td className="p-4 font-semibold text-slate-900">${pharmacy.revenue.toLocaleString()}</td>
                  <td className="p-4">
                    <StatusBadge status={pharmacy.status} />
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Pharmacy', icon: Building2, href: 'AdminAddPharmacy', color: 'bg-blue-100 text-blue-600' },
          { label: 'Add Pharmacist', icon: UserCog, href: 'AdminAddPharmacist', color: 'bg-purple-100 text-purple-600' },
          { label: 'View Orders', icon: ShoppingCart, href: 'AdminOrders', color: 'bg-emerald-100 text-emerald-600' },
          { label: 'System Settings', icon: Activity, href: 'AdminSettings', color: 'bg-amber-100 text-amber-600' },
        ].map((action, idx) => (
          <Link key={idx} to={createPageUrl(action.href)}>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="h-6 w-6" />
              </div>
              <p className="font-medium text-slate-900">{action.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
