import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    status: 'Processing',
    created_date: '2024-01-18T10:30:00Z',
    total_amount: 56.97,
    items_count: 3,
    estimated_delivery: '2024-01-25'
  },
  {
    id: 'ORD-2024-002',
    status: 'Shipped',
    created_date: '2024-01-15T09:15:00Z',
    total_amount: 32.99,
    items_count: 1,
    estimated_delivery: '2024-01-20'
  },
  {
    id: 'ORD-2023-156',
    status: 'Delivered',
    created_date: '2023-12-10T14:30:00Z',
    total_amount: 89.97,
    items_count: 4,
    estimated_delivery: '2023-12-15'
  },
];

const statusFilters = [
  { value: 'all', label: 'All Orders' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
];

export default function CustomerOrders() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="My Orders"
          description="View and manage your orders"
          breadcrumbs={[
            { label: 'Orders' }
          ]}
        />

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              {statusFilters.map((filter) => (
                <TabsTrigger 
                  key={filter.value} 
                  value={filter.value}
                  className="rounded-lg"
                >
                  {filter.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Package className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{order.id}</h3>
                      <Badge className={`
                        ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'} border-0
                      `}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {order.items_count} item{order.items_count !== 1 ? 's' : ''} • 
                      Placed on {new Date(order.created_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-lg text-slate-900">${order.total_amount.toFixed(2)}</p>
                    <p className="text-sm text-slate-500">
                      Est. delivery: {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
            <p className="text-slate-500 mb-4">Your order history will appear here</p>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
}
