import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { useCart } from '@/context/CartContext';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Tag,
  Truck,
  Shield,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function CustomerCart() {
  const { 
    cart: cartItems, 
    updateQuantity, 
    removeFromCart,
    cartTotal: subtotal,
    itemCount,
    clearCart,
    isInitialized
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Wait for cart to load from localStorage
  useEffect(() => {
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  const handleUpdateQuantity = (id, delta) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      const newQty = item.quantity + delta;
      if (newQty > 0) {
        updateQuantity(id, newQty);
      } else {
        removeFromCart(id);
      }
    }
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // Calculate totals based on real cart
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Check for prescription items
  const hasPrescriptionItems = cartItems.some(item => item.is_prescription_required);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your cart...</p>
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Shopping Cart"
          description={`${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart`}
          breadcrumbs={[
            { label: 'Cart' }
          ]}
        />

        {/* Prescription Warning */}
        {hasPrescriptionItems && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">Prescription Items in Cart</h4>
              <p className="text-amber-700 text-sm mt-1">
                Some items in your cart require a prescription. You'll need to provide a valid 
                prescription during checkout or contact a pharmacist for assistance.
              </p>
            </div>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-slate-500 mb-6">Looks like you haven't added any medications yet</p>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                Browse Medications
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-6"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name || item.medication_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <ShoppingBag className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                    {item.is_prescription_required && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                          Rx
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {item.name || item.medication_name}
                        </h3>
                        {item.dosage && (
                          <p className="text-sm text-slate-500 mt-1">{item.dosage}</p>
                        )}
                        <p className="text-emerald-600 font-bold text-lg mt-1">
                          ${(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-rose-500 shrink-0"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {item.is_prescription_required && (
                      <div className="mt-2 flex items-center gap-1 text-amber-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Prescription required</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-white"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-white"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-bold text-slate-900">
                        ${((item.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping & Clear Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl('CustomerMedications')} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    Continue Shopping
                  </Button>
                </Link>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                  {hasPrescriptionItems && (
                    <Link to="/prescriptions" className="flex-1">
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl border-amber-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        Upload Prescriptions
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                <h3 className="font-semibold text-lg text-slate-900 mb-4">Order Summary</h3>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl">Apply</Button>
                </div>

                {/* Totals */}
                <div className="space-y-3 pb-4 border-b border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-600' : ''}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4 text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                  <div className="bg-amber-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-amber-800">
                      Add <span className="font-bold">${(50 - subtotal).toFixed(2)}</span> more for free shipping!
                    </p>
                    <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link to={createPageUrl('CustomerCheckout')}>
                  <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    <span>Free shipping $50+</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Secure checkout</span>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Estimated delivery:</span> 2-4 business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Summary (Mobile only) */}
        {cartItems.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-xl font-bold text-slate-900">${total.toFixed(2)}</p>
              </div>
              <Link to={createPageUrl('CustomerCheckout')} className="flex-1 max-w-xs ml-4">
                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base">
                  Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <CustomerFooter />
    </div>
  );
}