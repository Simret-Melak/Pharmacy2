import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/ui-custom/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Pill, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const mockPharmacy = {
  id: '1',
  name: 'MediCare Central',
  address: '123 Health St, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'central@medicare.com',
  status: 'Active',
  pharmacist_count: 5,
  medication_count: 1200,
  total_orders: 4532,
  total_revenue: 145678.90,
  monthly_orders: 234,
  monthly_revenue: 12345.67,
};

export default function AdminPharmacyStats() {
  return (
    <AdminLayout title="Pharmacy Statistics">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminPharmacies')}>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{mockPharmacy.name}</h1>
            <p className="text-sm text-slate-500">Detailed statistics and performance metrics</p>
          </div>
        </div>
        <Link to={createPageUrl('AdminEditPharmacy')}>
          <Button variant="outline" className="rounded-xl">Edit Pharmacy</Button>
        </Link>
      </div>

      {/* Pharmacy Info Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="h-20 w-20 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
            <Building2 className="h-10 w-10 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{mockPharmacy.name}</h2>
              <Badge className="bg-emerald-100 text-emerald-700">{mockPharmacy.status}</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                {mockPharmacy.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                {mockPharmacy.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                {mockPharmacy.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Pharmacists"
          value={mockPharmacy.pharmacist_count}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Medications"
          value={mockPharmacy.medication_count.toLocaleString()}
          icon={Pill}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value={mockPharmacy.total_orders.toLocaleString()}
          icon={ShoppingCart}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockPharmacy.total_revenue.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Revenue Trend</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">Weekly</Button>
              <Button size="sm" className="rounded-lg bg-purple-600 hover:bg-purple-700">Monthly</Button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-2" />
              <p className="text-slate-500">Revenue trend chart</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Orders Overview</h2>
            <Badge className="bg-emerald-100 text-emerald-700">+15% this month</Badge>
          </div>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500">Orders chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-lg text-slate-900 mb-6">Monthly Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-3xl font-bold text-slate-900">{mockPharmacy.monthly_orders}</p>
            <p className="text-sm text-slate-500 mt-1">Orders This Month</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-600">${mockPharmacy.monthly_revenue.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">Revenue This Month</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-3xl font-bold text-slate-900">$52.78</p>
            <p className="text-sm text-slate-500 mt-1">Avg Order Value</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-3xl font-bold text-slate-900">4.8</p>
            <p className="text-sm text-slate-500 mt-1">Customer Rating</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
