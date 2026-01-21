import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Bell, Search, User, LogOut, Menu, X } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { getCurrentUser, clearAuth } from '@/utils/api';
import { useCart } from '@/context/CartContext'; 

const CustomerHeader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // USE CART CONTEXT INSTEAD OF LOCAL STATE
  const { itemCount } = useCart();

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Call logout API
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5001/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Clear local storage
      clearAuth();
      
      // Close mobile menu if open
      setMobileMenuOpen(false);
      
      // Redirect to login page
      navigate(createPageUrl('CustomerLogin'));
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if API call fails
      clearAuth();
      navigate(createPageUrl('CustomerLogin'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    // Redirect to medications page with search focused
    setMobileMenuOpen(false);
    navigate(createPageUrl('CustomerMedications'));
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link to={createPageUrl('CustomerHome')} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:inline">MediCare</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to={createPageUrl('CustomerHome')} className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
              Home
            </Link>
            <Link to={createPageUrl('CustomerMedications')} className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
              Medications
            </Link>
            <Link to={createPageUrl('CustomerPrescriptions')} className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
              Prescriptions
            </Link>
            <Link to={createPageUrl('CustomerOrders')} className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
              Orders
            </Link>
            <Link to={createPageUrl('CustomerProfile')} className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
              Profile
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-slate-600" />
          ) : (
            <Menu className="h-5 w-5 text-slate-600" />
          )}
        </button>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search Button (Desktop) */}
          <button 
            onClick={handleSearchClick}
            className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Search className="h-4 w-4" />
            Search medications...
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500"></span>
          </button>
          
          {/* Cart with Context Count */}
          <Link 
            to={createPageUrl('CustomerCart')} 
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
            onClick={handleNavClick}
          >
            <ShoppingCart className="h-5 w-5 text-slate-600" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-xs text-white flex items-center justify-center font-medium">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
          
          {/* User Profile/Login */}
          {user ? (
            <div className="relative group">
              <button className="hidden md:flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 hover:bg-slate-200 transition-colors">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700 truncate max-w-[100px]">
                  {user.full_name?.split(' ')[0] || user.username || 'User'}
                </span>
              </button>
              
              {/* Desktop Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-slate-200 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.full_name || user.username}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <p className="text-xs text-emerald-600 mt-1 capitalize">{user.role}</p>
                </div>
                
                <div className="p-1">
                  <Link 
                    to={createPageUrl('CustomerProfile')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
                    onClick={handleNavClick}
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="h-4 w-4" />
                    {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                to={createPageUrl('CustomerLogin')}
                className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
                onClick={handleNavClick}
              >
                Login
              </Link>
              <span className="text-slate-300">|</span>
              <Link 
                to={createPageUrl('CustomerRegister')}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                onClick={handleNavClick}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {/* Search in Mobile Menu */}
              <button 
                onClick={handleSearchClick}
                className="flex items-center gap-2 w-full px-3 py-3 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Search className="h-4 w-4" />
                Search medications...
              </button>
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="px-4 py-2 border-t border-slate-100">
              <Link 
                to={createPageUrl('CustomerHome')}
                className="flex items-center px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={handleNavClick}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl('CustomerMedications')}
                className="flex items-center px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={handleNavClick}
              >
                Medications
              </Link>
              <Link 
                to={createPageUrl('CustomerPrescriptions')}
                className="flex items-center px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={handleNavClick}
              >
                Prescriptions
              </Link>
              <Link 
                to={createPageUrl('CustomerOrders')}
                className="flex items-center px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={handleNavClick}
              >
                Orders
              </Link>
              <Link 
                to={createPageUrl('CustomerProfile')}
                className="flex items-center px-3 py-3 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                onClick={handleNavClick}
              >
                Profile
              </Link>
            </div>
            
            {/* User Info in Mobile Menu */}
            {user ? (
              <div className="px-4 py-3 border-t border-slate-100">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-900">{user.full_name || user.username}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <p className="text-xs text-emerald-600 mt-1 capitalize">{user.role}</p>
                </div>
                
                <div className="mt-2 space-y-1">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-2 w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to={createPageUrl('CustomerLogin')}
                    className="px-3 py-3 text-center text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                    onClick={handleNavClick}
                  >
                    Login
                  </Link>
                  <Link 
                    to={createPageUrl('CustomerRegister')}
                    className="px-3 py-3 text-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    onClick={handleNavClick}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default CustomerHeader;