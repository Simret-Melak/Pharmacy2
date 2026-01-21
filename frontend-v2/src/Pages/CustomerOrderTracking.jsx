import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  Phone,
  MessageSquare
} from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    status: 'Processing',
    created_date: '2024-01-18T10:30:00Z',
    estimated_delivery: '2024-01-25',
    total_amount: 56.97,
    items: [
      { name: 'Vitamin D3 5000 IU', quantity: 2, price: 15.99 },
      { name: 'Ibuprofen 400mg', quantity: 1, price: 8.99 },
    ],
    shipping_address: '123 Health Street, New York, NY 10001',
    timeline: [
      { status: 'Order Placed', date: '2024-01-18T10:30:00Z', completed: true },
      { status: 'Processing', date: '2024-01-18T14:00:00Z', completed: true, current: true },
      { status: 'Shipped', date: null, completed: false },
      { status: 'Delivered', date: null, completed: false },
    ]
  },
  {
    id: 'ORD-2024-002',
    status: 'Ready',
    created_date: '2024-01-15T09:15:00Z',
    estimated_delivery: '2024-01-20',
    total_amount: 32.99,
    items: [
      { name: 'Omega-3 Fish Oil', quantity: 1, price: 24.99 },
    ],
    shipping_address: '123 Health Street, New York, NY 10001',
    timeline: [
      { status: 'Order Placed', date: '2024-01-15T09:15:00Z', completed: true },
      { status: 'Processing', date: '2024-01-15T12:00:00Z', completed: true },
      { status: 'Shipped', date: '2024-01-16T08:00:00Z', completed: true, current: true },
      { status: 'Delivered', date: null, completed: false },
    ]
  },
];

const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function CustomerOrderTracking() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Order Tracking"
          description="Track your active orders"
          breadcrumbs={[
            { label: 'Orders', href: 'CustomerOrders' },
            { label: 'Tracking' }
          ]}
        />

        <div className="space-y-6">
          {mockOrders.map((order) => {
            const currentStepIndex = order.timeline.findIndex(t => t.current);
            
            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg text-slate-900">{order.id}</h3>
                        <Badge className={`
                          ${order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                            order.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'} border-0
                        `}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        Placed on {new Date(order.created_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" className="rounded-xl">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 bg-slate-50">
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                      />
                    </div>
                    
                    {/* Steps */}
                    <div className="relative flex justify-between">
                      {order.timeline.map((step, idx) => {
                        const StepIcon = step.status === 'Order Placed' ? Clock :
                                        step.status === 'Processing' ? Package :
                                        step.status === 'Shipped' ? Truck : CheckCircle;
                        return (
                          <div key={idx} className="flex flex-col items-center text-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center z-10 transition-all ${
                              step.completed 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-white border-2 border-slate-200 text-slate-400'
                            } ${step.current ? 'ring-4 ring-emerald-100' : ''}`}>
                              <StepIcon className="h-5 w-5" />
                            </div>
                            <p className={`mt-2 text-sm font-medium ${step.completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {step.status}
                            </p>
                            {step.date && (
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(step.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-emerald-900">Estimated Delivery</p>
                        <p className="text-sm text-emerald-700">
                          {new Date(order.estimated_delivery).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Items */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600">{item.name} × {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-100 flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${order.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">Shipping Address</h4>
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 mt-0.5 text-slate-400" />
                        <span>{order.shipping_address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {mockOrders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No active orders</h3>
            <p className="text-slate-500 mb-4">You don't have any orders to track right now</p>
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
