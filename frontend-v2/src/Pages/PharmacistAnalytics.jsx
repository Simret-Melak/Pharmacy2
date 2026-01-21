import PharmacistLayout from '@/components/pharmacist/PharmacistLayout';
import StatCard from '@/components/ui-custom/StatCard';
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
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download
} from 'lucide-react';

const topSellingMedications = [
  { name: 'Vitamin D3 5000 IU', sales: 234, revenue: 3741.66, trend: '+12%' },
  { name: 'Ibuprofen 400mg', sales: 189, revenue: 1699.11, trend: '+8%' },
  { name: 'Omega-3 Fish Oil', sales: 156, revenue: 3898.44, trend: '+15%' },
  { name: 'Metformin 850mg', sales: 132, revenue: 3298.68, trend: '-3%' },
  { name: 'Amoxicillin 500mg', sales: 98, revenue: 1273.02, trend: '+5%' },
];

const recentSales = [
  { id: 'ORD-001', customer: 'John Smith', amount: 45.99, time: '5 min ago' },
  { id: 'ORD-002', customer: 'Emily Davis', amount: 23.50, time: '15 min ago' },
  { id: 'ORD-003', customer: 'Michael Brown', amount: 89.99, time: '30 min ago' },
  { id: 'ORD-004', customer: 'Sarah Wilson', amount: 34.00, time: '1 hour ago' },
  { id: 'ORD-005', customer: 'David Lee', amount: 67.50, time: '2 hours ago' },
];

export default function PharmacistAnalytics() {
  return (
    <PharmacistLayout title="Sales & Revenue Analytics">
      {/* Date Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-44 rounded-xl">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="$28,459.00"
          icon={DollarSign}
          trend="+18.2%"
          trendUp={true}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          icon={ShoppingCart}
          trend="+12.5%"
          trendUp={true}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Average Order"
          value="$23.05"
          icon={TrendingUp}
          trend="+5.8%"
          trendUp={true}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Products Sold"
          value="3,456"
          icon={Package}
          trend="+15.3%"
          trendUp={true}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Revenue Overview</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-lg">Daily</Button>
              <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700">Weekly</Button>
              <Button variant="outline" size="sm" className="rounded-lg">Monthly</Button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500">Revenue chart visualization</p>
              <p className="text-sm text-slate-400">Integrate with recharts for live data</p>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900">Orders Overview</h2>
            <Badge className="bg-emerald-100 text-emerald-700">+23% this week</Badge>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-blue-400 mx-auto mb-2" />
              <p className="text-slate-500">Orders chart visualization</p>
              <p className="text-sm text-slate-400">Bar chart showing daily orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-lg text-slate-900">Top Selling Medications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {topSellingMedications.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-semibold text-slate-600">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${item.revenue.toFixed(2)}</p>
                    <div className={`flex items-center gap-1 text-sm ${
                      item.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {item.trend.startsWith('+') ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {item.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-semibold text-lg text-slate-900">Recent Sales</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSales.map((sale, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{sale.customer}</p>
                      <p className="text-sm text-slate-500">{sale.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">${sale.amount.toFixed(2)}</p>
                    <p className="text-sm text-slate-400">{sale.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-semibold text-lg text-slate-900 mb-6">Sales by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Vitamins', value: 32, color: 'bg-amber-500' },
            { name: 'Pain Relief', value: 24, color: 'bg-rose-500' },
            { name: 'Antibiotics', value: 18, color: 'bg-blue-500' },
            { name: 'Allergy', value: 12, color: 'bg-purple-500' },
            { name: 'Diabetes', value: 8, color: 'bg-emerald-500' },
            { name: 'Other', value: 6, color: 'bg-slate-500' },
          ].map((cat, idx) => (
            <div key={idx} className="text-center p-4 bg-slate-50 rounded-xl">
              <div className={`h-3 w-full rounded-full ${cat.color} mb-3`} />
              <p className="font-semibold text-slate-900">{cat.value}%</p>
              <p className="text-sm text-slate-500">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </PharmacistLayout>
  );
}
