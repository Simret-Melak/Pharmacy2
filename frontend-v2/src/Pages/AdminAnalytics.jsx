import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
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
  Users,
  Building2,
  Pill,
  Calendar,
  Download,
  BarChart3,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('month');
  const [chartType, setChartType] = useState('revenue');

  // Mock data
  const systemStats = {
    totalRevenue: 1254789.50,
    totalOrders: 34521,
    activeUsers: 8543,
    totalPharmacies: 24,
    totalMedications: 12470,
    avgOrderValue: 36.32,
    conversionRate: 4.2,
    customerRetention: 78.5
  };

  const pharmacyPerformance = [
    { id: 1, name: 'MediCare Central', orders: 4532, revenue: 145678, medications: 1200, growth: 12.5, status: 'high' },
    { id: 2, name: 'HealthFirst Pharmacy', orders: 2341, revenue: 89234, medications: 890, growth: 8.2, status: 'medium' },
    { id: 3, name: 'CareWell Drugs', orders: 3210, revenue: 112456, medications: 1050, growth: 15.3, status: 'high' },
    { id: 4, name: 'QuickMeds Express', orders: 1234, revenue: 45678, medications: 650, growth: -3.2, status: 'low' },
    { id: 5, name: 'Family Pharmacy', orders: 876, revenue: 34567, medications: 540, growth: 5.7, status: 'medium' },
  ];

  const revenueByMonth = [
    { month: 'Jan', revenue: 98500 },
    { month: 'Feb', revenue: 112300 },
    { month: 'Mar', revenue: 124500 },
    { month: 'Apr', revenue: 118900 },
    { month: 'May', revenue: 135600 },
    { month: 'Jun', revenue: 142300 },
  ];

  const orderCategories = [
    { category: 'Prescription', count: 12450, percentage: 36 },
    { category: 'OTC Medications', count: 15670, percentage: 45 },
    { category: 'Health & Wellness', count: 4230, percentage: 12 },
    { category: 'Medical Supplies', count: 2171, percentage: 7 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value}%`;
  };

  const getGrowthColor = (value) => {
    if (value > 10) return 'text-emerald-600';
    if (value > 0) return 'text-emerald-500';
    if (value < 0) return 'text-rose-600';
    return 'text-slate-500';
  };

  const getGrowthIcon = (value) => {
    if (value > 0) return <ArrowUpRight className="h-4 w-4" />;
    if (value < 0) return <ArrowDownRight className="h-4 w-4" />;
    return null;
  };

  return (
    <AdminLayout title="System Analytics">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500">System-wide performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
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
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(systemStats.totalRevenue)}
          icon={DollarSign}
          trend="+18.2%"
          trendUp={true}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          description="Year-over-year growth"
        />
        <StatCard
          title="Total Orders"
          value={systemStats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="+12.5%"
          trendUp={true}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          description="Across all pharmacies"
        />
        <StatCard
          title="Active Users"
          value={systemStats.activeUsers.toLocaleString()}
          icon={Users}
          trend="+8.3%"
          trendUp={true}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          description="30-day active users"
        />
        <StatCard
          title="Pharmacies"
          value={systemStats.totalPharmacies}
          icon={Building2}
          trend="+2"
          trendUp={true}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          description="Active locations"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg. Order Value</p>
              <p className="text-xl font-bold text-slate-900">${systemStats.avgOrderValue.toFixed(2)}</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-0">+$2.15</Badge>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Conversion Rate</p>
              <p className="text-xl font-bold text-slate-900">{systemStats.conversionRate}%</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-0">+0.8%</Badge>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Customer Retention</p>
              <p className="text-xl font-bold text-slate-900">{systemStats.customerRetention}%</p>
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-0">+5.2%</Badge>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Medications</p>
              <p className="text-xl font-bold text-slate-900">{systemStats.totalMedications.toLocaleString()}</p>
            </div>
            <Badge className="bg-cyan-100 text-cyan-700 border-0">+420</Badge>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg text-slate-900">Revenue Trend</h2>
              <p className="text-sm text-slate-500">Monthly revenue performance</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">+18% overall</Badge>
          </div>
          <div className="h-64">
            {/* Simple bar chart visualization */}
            <div className="flex items-end justify-between h-full px-4 pb-4">
              {revenueByMonth.map((item, index) => {
                const heightPercentage = (item.revenue / 150000) * 100;
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-300"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span className="mt-2 text-xs text-slate-500">{item.month}</span>
                    <span className="text-xs font-medium text-slate-700">
                      ${(item.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-slate-600">Revenue</span>
              </div>
              <div className="text-sm text-slate-500">
                Total: {formatCurrency(revenueByMonth.reduce((sum, item) => sum + item.revenue, 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-lg text-slate-900">Orders by Category</h2>
              <p className="text-sm text-slate-500">Breakdown of order types</p>
            </div>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-64">
            {/* Donut chart visualization */}
            <div className="relative h-40 w-40 mx-auto my-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">34,521</p>
                  <p className="text-sm text-slate-500">Total Orders</p>
                </div>
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Donut segments */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="36 100" strokeDashoffset="25" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="45 100" strokeDashoffset="-11" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="12 100" strokeDashoffset="-56" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="7 100" strokeDashoffset="-68" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {orderCategories.map((category, index) => {
                const colors = ['bg-purple-100', 'bg-blue-100', 'bg-emerald-100', 'bg-amber-100'];
                const textColors = ['text-purple-700', 'text-blue-700', 'text-emerald-700', 'text-amber-700'];
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${colors[index]}`}></div>
                      <span className="text-sm font-medium text-slate-700">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{category.count.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{category.percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-lg text-slate-900">Pharmacy Performance</h2>
            <p className="text-sm text-slate-500">Ranked by revenue and growth</p>
          </div>
          <Button variant="outline" className="rounded-xl">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Detailed Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Pharmacy</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Orders</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Revenue</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Medications</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Growth</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pharmacyPerformance.map((pharmacy) => (
                <tr key={pharmacy.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 block">{pharmacy.name}</span>
                        <span className="text-xs text-slate-500">ID: PH{pharmacy.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{pharmacy.orders.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">Orders</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{formatCurrency(pharmacy.revenue)}</div>
                    <div className="text-xs text-slate-500">Revenue</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{pharmacy.medications}</span>
                    </div>
                    <div className="text-xs text-slate-500">Stock items</div>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center gap-1 ${getGrowthColor(pharmacy.growth)}`}>
                      {getGrowthIcon(pharmacy.growth)}
                      <span className="font-semibold">{formatPercentage(pharmacy.growth)}</span>
                    </div>
                    <div className="text-xs text-slate-500">MoM growth</div>
                  </td>
                  <td className="p-4">
                    <Badge className={`
                      ${pharmacy.status === 'high' ? 'bg-emerald-100 text-emerald-700' : 
                        pharmacy.status === 'medium' ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'} border-0
                    `}>
                      {pharmacy.status === 'high' ? 'High Performer' : 
                       pharmacy.status === 'medium' ? 'Average' : 'Needs Attention'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-600">
              Showing {pharmacyPerformance.length} of {systemStats.totalPharmacies} pharmacies
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">High: 3 pharmacies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-slate-600">Average: 2 pharmacies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                <span className="text-slate-600">Low: 1 pharmacy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900">Top Insights</h3>
              <p className="text-sm text-emerald-700 mt-1">
                MediCare Central leads with 32% revenue share. HealthFirst Pharmacy shows strongest growth at +15.3%.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font
              -semibold text-blue-900">Order Trends</h3>
              <p className="text-sm text-blue-700 mt-1">
                Prescription orders increased by 24% this month. OTC medications remain most popular category.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">User Engagement</h3>
              <p className="text-sm text-purple-700 mt-1">
                Customer retention improved by 5.2%. New user acquisition grew by 18% month-over-month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}