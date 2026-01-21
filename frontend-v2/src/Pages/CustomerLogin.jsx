import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Logo from '@/components/ui-custom/Logo';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { authAPI } from '@/utils/api';

export default function CustomerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call the API using authAPI utility
      const data = await authAPI.login(formData.email, formData.password);
      
      console.log('Login successful:', data);
      
      // Store token and user data
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        // Clear guest session if exists
        if (data.clearGuestSession) {
          localStorage.removeItem('guestToken');
          localStorage.removeItem('guestData');
        }

        // Redirect based on user role
        const user = data.user;
        
        switch(user.role) {
          case 'admin':
            navigate(createPageUrl('AdminDashboard'));
            break;
          case 'pharmacist':
            navigate(createPageUrl('PharmacistDashboard'));
            break;
          default:
            navigate(createPageUrl('CustomerHome'));
        }
      }

    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // For future social login integration
    console.log(`Social login with ${provider}`);
    // You can implement OAuth flows here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex">
      {/* Left Panel - Branding */}
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
        
        <div className="relative space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <img 
              src="https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600"
              alt="Healthcare"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold text-white mb-2">Quality Healthcare at Your Fingertips</h3>
            <p className="text-emerald-100">Access thousands of medications, upload prescriptions, and track your orders from anywhere.</p>
          </div>
        </div>
        
        <div className="relative text-emerald-100 text-sm">
          © 2024 MediCare Pharmacy. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center text-red-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Login Failed</span>
              </div>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email address</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <Link 
                  to={createPageUrl('CustomerForgotPassword')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({...formData, rememberMe: checked})}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-base font-medium transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Don't have an account?{' '}
              <Link 
                to={createPageUrl('CustomerRegister')}
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                onClick={() => handleSocialLogin('Apple')}
                disabled={isLoading}
              >
                <img src="https://www.apple.com/favicon.ico" alt="Apple" className="h-5 w-5 mr-2" />
                Apple
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => navigate('/guest-checkout')}
                disabled={isLoading}
              >
                Continue as guest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}