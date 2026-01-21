import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { CheckCircle, Package, Clock, Truck, Home } from 'lucide-react';

export default function OrderSuccess() {
  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <PageHeader
            title=""
            breadcrumbs={[
              { label: 'Orders' },
              { label: 'Order Confirmation' }
            ]}
          />

          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 mb-6">Thank you for your order. We've received your order and will process it shortly.</p>
            
            <div className="bg-slate-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-slate-500 mb-2">Order Number</p>
              <p className="text-xl font-bold text-slate-900 mb-4">ORD-123456</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">2 items</p>
                    <p className="text-xs text-slate-500">Total: $45.97</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Processing</p>
                    <p className="text-xs text-slate-500">Estimated delivery: 3-5 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Standard Shipping</p>
                    <p className="text-xs text-slate-500">Free</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600">
                We'll send you a confirmation email with tracking information once your order ships.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button variant="outline" className="w-full sm:w-auto rounded-xl">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                    View Order Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
}
