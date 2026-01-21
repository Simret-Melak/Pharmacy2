import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Settings,
  Bell,
  Search,
  User,
  FileText,
  LogOut,
  ChevronDown
} from 'lucide-react';

const PharmacistLayout = ({ children, title }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pharmacistData, setPharmacistData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    initials: 'PJ'
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const navItems = [
    { path: '/pharmacist', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/pharmacist/inventory', icon: Package, label: 'Inventory' },
    { path: '/pharmacist/add-medication', icon: PlusCircle, label: 'Add Medication' },
    { path: '/pharmacist/prescriptions', icon: FileText, label: 'Prescriptions' },
    { path: '/pharmacist/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/pharmacist/customers', icon: Users, label: 'Customers' },
    { path: '/pharmacist/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/pharmacist/settings', icon: Settings, label: 'Settings' },
    { path: '/pharmacist/profile', icon: User, label: 'My Profile' },
  ];

  // Fetch pharmacist data on component mount
  useEffect(() => {
    fetchPharmacistData();
  }, []);

  const fetchPharmacistData = async () => {
    try {
      // Get token from localStorage (adjust based on how you store tokens)
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('supabase.auth.token') ||
                    sessionStorage.getItem('token');
      
      if (!token) {
        console.warn('No authentication token found');
        setDefaultData();
        setIsLoading(false);
        return;
      }

      // Parse token if it's stored as JSON string
      let authToken = token;
      if (token.startsWith('{')) {
        try {
          const tokenData = JSON.parse(token);
          authToken = tokenData.access_token || tokenData.token || token;
        } catch (e) {
          console.log('Token is not JSON, using as is');
        }
      }

      console.log('Fetching pharmacist profile data...');
      
      // Call backend API to get pharmacist profile
      const response = await fetch('http://localhost:5001/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Include cookies if using session-based auth
      });

      if (response.status === 401) {
        console.warn('Authentication failed, redirecting to login');
        clearAuthData();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile API response:', data);

      if (data.success && data.user) {
        const user = data.user;
        
        // Extract pharmacist data from response
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        const email = user.email || '';
        
        // Generate initials for display
        const initials = (
          (firstName.charAt(0) || 'P') + 
          (lastName.charAt(0) || 'J')
        ).toUpperCase();

        console.log('Setting pharmacist data:', { firstName, lastName, email, initials });
        
        // Update state with pharmacist data
        setPharmacistData({
          firstName,
          lastName,
          email,
          initials
        });

        // Also store in localStorage for quick access
        localStorage.setItem('pharmacistData', JSON.stringify({
          firstName,
          lastName,
          email,
          initials
        }));
      } else {
        console.error('API returned error:', data.message);
        setDefaultData();
      }
    } catch (error) {
      console.error('Error fetching pharmacist data:', error);
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('user');
    localStorage.removeItem('pharmacistData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const setDefaultData = () => {
    // Try to get cached data first
    const cachedData = localStorage.getItem('pharmacistData');
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setPharmacistData(data);
        return;
      } catch (e) {
        console.error('Error parsing cached pharmacist data:', e);
      }
    }

    // Fallback to hardcoded placeholder data
    setPharmacistData({
      firstName: 'Pharm',
      lastName: 'Johnson',
      email: 'pharmacist@medipharm.com',
      initials: 'PJ'
    });
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  // Helper functions for display
  const getFullName = () => {
    if (pharmacistData.firstName && pharmacistData.lastName) {
      return `${pharmacistData.firstName} ${pharmacistData.lastName}`;
    } else if (pharmacistData.firstName) {
      return pharmacistData.firstName;
    } else if (pharmacistData.lastName) {
      return pharmacistData.lastName;
    }
    return 'Pharmacist';
  };

  const getDisplayName = () => {
    const fullName = getFullName();
    return fullName === 'Pharmacist' ? 'Pharm. Johnson' : `Dr. ${fullName}`;
  };

  const getShortName = () => {
    if (pharmacistData.firstName) {
      return pharmacistData.firstName;
    }
    return 'Profile';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/pharmacist" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600"></div>
            <span className="text-xl font-bold text-slate-900">MediPharm</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full ml-2">Pharmacist</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/pharmacist' && location.pathname === '/pharmacist') ||
                            (item.path !== '/pharmacist' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="flex items-center justify-between gap-3">
            <Link 
              to="/pharmacist/profile" 
              className="flex items-center gap-3 flex-1 hover:bg-slate-50 p-2 rounded-xl transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="font-semibold text-emerald-700">
                  {isLoading ? 'PJ' : pharmacistData.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {isLoading ? 'Loading...' : getDisplayName()}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {isLoading ? 'pharmacist@medipharm.com' : pharmacistData.email}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex h-16 items-center justify-between px-8">
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search medications, orders..."
                  className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>
              
              <Link 
                to="/pharmacist/profile"
                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 hover:bg-slate-200 transition-colors group"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-emerald-700">
                    {isLoading ? 'PJ' : pharmacistData.initials}
                  </span>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-slate-700">
                    {isLoading ? 'Profile' : getShortName()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500 inline-block ml-2 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PharmacistLayout;