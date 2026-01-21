import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import CustomerHeader from '@/components/customer/CustomerHeader';
import CustomerFooter from '@/components/customer/CustomerFooter';
import PageHeader from '@/components/ui-custom/PageHeader';
import { useCart } from '@/context/CartContext';
import { api } from '@/utils/api';
import { 
  CreditCard, 
  Truck, 
  MapPin,
  Lock,
  Shield,
  Check,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function CustomerCheckout() {
  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: '',
    agreeToTerms: false
  });
  
  const navigate = useNavigate();
  const { cart: cartItems, cartTotal: subtotal, itemCount, clearCart } = useCart();

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(userData);
    
    // Pre-fill form with user data if available
    if (userData) {
      const nameParts = (userData.full_name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: userData.email || '',
        phone: userData.phone || ''
      }));
    }
    
    // Check if cart is empty
    if (cartItems.length === 0 && !orderPlaced) {
      navigate(createPageUrl('CustomerCart'));
    }
  }, [cartItems, navigate, orderPlaced]);

  // Check for prescription items
  const hasPrescriptionItems = cartItems.some(item => item.is_prescription_required);

  const shipping = shippingMethod === 'express' ? 12.99 : subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 1, label: 'Shipping', icon: Truck },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Review', icon: Check },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    // Check if user is logged in
    if (!user) {
      setError('Please login to place an order');
      navigate(createPageUrl('CustomerLogin'));
      return;
    }

    // Validate prescription items
    if (hasPrescriptionItems) {
      setError('Prescription items require pharmacist review. Please contact us to complete your order.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          medication_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        },
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: tax,
        total: total,
        notes: hasPrescriptionItems ? 'Contains prescription items requiring review' : ''
      };

      console.log('Placing order with data:', orderData);

      // TODO: Uncomment when backend is ready
      // const response = await api.post('/orders', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful order
      const mockOrderId = `ORD-${Date.now()}`;
      
      // Mark order as placed
      setOrderPlaced(true);
      
      // Clear cart
      clearCart();
      
      // Navigate to success page
      navigate(`/order-success?orderId=${mockOrderId}&total=${total.toFixed(2)}`);
      
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50">
        <CustomerHeader />
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Checkout"
            breadcrumbs={[
              { label: 'Cart', href: 'CustomerCart' },
              { label: 'Checkout' }
            ]}
          />
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h3>
            <p className="text-slate-500 mb-6">Add items to your cart before checking out</p>
            <Link to={createPageUrl('CustomerMedications')}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
                Browse Medications
              </Button>
            </Link>
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
          title="Checkout"
          breadcrumbs={[
            { label: 'Cart', href: 'CustomerCart' },
            { label: 'Checkout' }
          ]}
        />

        {/* Prescription Warning */}
        {hasPrescriptionItems && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800">Prescription Items in Order</h4>
              <p className="text-amber-700 text-sm mt-1">
                Your order contains prescription medications. After placing your order, 
                our pharmacists will review your prescription and contact you if needed.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    step === s.id 
                      ? 'bg-emerald-600 text-white' 
                      : step > s.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Shipping Address
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input 
                      placeholder="John" 
                      className="rounded-xl" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input 
                      placeholder="Doe" 
                      className="rounded-xl" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Street Address *</Label>
                    <Input 
                      placeholder="123 Main Street" 
                      className="rounded-xl" 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Apartment, suite, etc. (optional)</Label>
                    <Input 
                      placeholder="Apt 4B" 
                      className="rounded-xl" 
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City *</Label>
                    <Input 
                      placeholder="New York" 
                      className="rounded-xl" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Input 
                      placeholder="NY" 
                      className="rounded-xl" 
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP Code *</Label>
                    <Input 
                      placeholder="10001" 
                      className="rounded-xl" 
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input 
                      placeholder="+1 (555) 000-0000" 
                      className="rounded-xl" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-emerald-600" />
                    Shipping Method
                  </h3>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                    <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                      shippingMethod === 'standard' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="cursor-pointer">
                          <span className="font-medium">Standard Shipping</span>
                          <p className="text-sm text-slate-500">5-7 business days</p>
                        </Label>
                      </div>
                      <span className="font-semibold">{subtotal >= 50 ? 'FREE' : '$5.99'}</span>
                    </div>
                    <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                      shippingMethod === 'express' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="cursor-pointer">
                          <span className="font-medium">Express Shipping</span>
                          <p className="text-sm text-slate-500">2-3 business days</p>
                        </Label>
                      </div>
                      <span className="font-semibold">$12.99</span>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  onClick={() => setStep(2)}
                  disabled={!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.phone}
                >
                  Continue to Payment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Payment Method
                </h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                    paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer font-medium">Credit/Debit Card</Label>
                    </div>
                    <div className="flex gap-2">
                      <img src="https://cdn-icons-png.flaticon.com/24/349/349221.png" alt="Visa" className="h-6" />
                      <img src="https://cdn-icons-png.flaticon.com/24/349/349228.png" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                  <div className={`flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                    paymentMethod === 'paypal' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer font-medium">PayPal</Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                      <Label>Card Number *</Label>
                      <Input 
                        placeholder="1234 5678 9012 3456" 
                        className="rounded-xl" 
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry Date *</Label>
                        <Input 
                          placeholder="MM/YY" 
                          className="rounded-xl" 
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV *</Label>
                        <Input 
                          placeholder="123" 
                          className="rounded-xl" 
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cardholder Name *</Label>
                      <Input 
                        placeholder="John Doe" 
                        className="rounded-xl" 
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl">
                  <Lock className="h-5 w-5 text-slate-500" />
                  <span className="text-sm text-slate-600">Your payment information is secure and encrypted</span>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                    onClick={() => setStep(3)}
                    disabled={paymentMethod === 'card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName)}
                  >
                    Review Order
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Review Your Order</h2>
                  
                  {/* Items */}
                  <div className="space-y-4 pb-4 border-b border-slate-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden">
                          <img 
                            src={item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{item.name || item.medication_name}</h4>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          {item.is_prescription_required && (
                            <span className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full mt-1">
                              Prescription Required
                            </span>
                          )}
                        </div>
                        <p className="font-semibold">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="py-4 border-b border-slate-100">
                    <h3 className="font-medium text-slate-900 mb-2">Shipping Address</h3>
                    <p className="text-slate-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}{formData.apartment ? `, ${formData.apartment}` : ''}<br />
                      {formData.city}, {formData.state} {formData.zipCode}<br />
                      {formData.phone}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="pt-4">
                    <h3 className="font-medium text-slate-900 mb-2">Payment Method</h3>
                    <p className="text-slate-600">
                      {paymentMethod === 'card' ? 'Credit Card' : 'PayPal'}
                      {paymentMethod === 'card' && formData.cardNumber && (
                        <span className="ml-2 text-sm">ending in {formData.cardNumber.slice(-4)}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>

                {!user && (
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-amber-700 text-sm">
                      Please login to place your order. <Link to="/login" className="font-semibold underline">Login here</Link>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12"
                    onClick={handlePlaceOrder}
                    disabled={loading || !formData.agreeToTerms || !user}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Place Order - ${total.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h3 className="font-semibold text-lg text-slate-900 mb-4">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-3 pb-4 border-b border-slate-100 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden relative">
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.name || item.medication_name}</p>
                      <p className="text-xs text-slate-500">${(item.price || 0).toFixed(2)} each</p>
                    </div>
                    <p className="text-sm font-semibold">${((item.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 py-4 border-b border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-600' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
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

              {/* Security */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-slate-500">100% secure checkout</span>
              </div>

              {/* Prescription Notice */}
              {hasPrescriptionItems && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-700">
                    ⚠️ Your order contains prescription medications that require pharmacist review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CustomerFooter />
    </div>
  );
}