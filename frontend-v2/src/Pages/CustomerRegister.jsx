import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/ui-custom/Logo';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';
import { api } from '@/utils/api';

export default function CustomerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'One number', met: /[0-9]/.test(formData.password) },
    { label: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(formData.password) },
    { label: 'Passwords match', met: formData.password && formData.password === formData.confirmPassword }
  ];

  // Check if all password requirements are met
  const isPasswordValid = passwordRequirements.slice(0, 5).every(req => req.met);
  const canSubmit = isPasswordValid && formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet all requirements');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for backend
      const registerData = {
        email: formData.email.trim(),
        password: formData.password,
        username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone.trim()
      };

      console.log('Registering user with data:', registerData);

      // Call the register endpoint
      const response = await api.post('/auth/register', registerData);
      
      console.log('Registration successful:', response);

      // Show success message
      setSuccessMessage(response.message || 'Registration successful! You can now login.');

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate(createPageUrl('CustomerLogin'));
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle specific error messages
      if (err.message.includes('already registered') || err.message.includes('already exists')) {
        setError('An account with this email already exists. Please login instead.');
      } else if (err.message.includes('password')) {
        setError('Password does not meet requirements. Please check the password guidelines.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Logo size="md" showText={false} />
            </div>
            <span className="text-2xl font-bold text-white">MediCare</span>
          </div>
          <p className="text-emerald-100 text-lg mt-1">Your Health, Our Priority</p>
        </div>
        
        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white">Join MediCare Today</h2>
          <div className="space-y-4">
            {[
              'Access to 10,000+ medications',
              'Easy prescription uploads',
              'Fast home delivery',
              '24/7 customer support',
              'Track orders in real-time'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-white">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative text-emerald-100 text-sm">
          © 2024 MediCare Pharmacy. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500">Start your healthcare journey with us</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center text-red-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Registration Failed</span>
              </div>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center text-emerald-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Registration Successful!</span>
              </div>
              <p className="mt-1 text-sm text-emerald-600">{successMessage}</p>
              <p className="mt-2 text-sm text-emerald-600">
                Redirecting to login page...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-700 font-medium">First name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-700 font-medium">Last name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700 font-medium">Phone number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm password *</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Password requirements:</p>
              {passwordRequirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                    req.met ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}>
                    {req.met && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`text-sm ${req.met ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !canSubmit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link 
                to={createPageUrl('CustomerLogin')}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}