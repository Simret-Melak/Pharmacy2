import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  UserCog, 
  Pill,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  User
} from 'lucide-react';

const AdminLayout = ({ children, title }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/pharmacies', icon: Building2, label: 'Pharmacies' },
    { path: '/admin/pharmacists', icon: UserCog, label: 'Pharmacists' },
    { path: '/admin/medications', icon: Pill, label: 'Medications' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-600"></div>
            <span className="text-xl font-bold text-slate-900">MediPharm</span>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full ml-2">Admin</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/admin' && location.pathname === '/admin') ||
                            (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700' 
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="font-semibold text-purple-700">SA</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">System Admin</p>
              <p className="text-xs text-slate-500">admin@medipharm.com</p>
            </div>
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
                  placeholder="Search pharmacies, orders..."
                  className="h-10 w-64 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500"></span>
              </button>
              
              <button className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 hover:bg-slate-200 transition-colors">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Profile</span>
              </button>
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

export default AdminLayout;
