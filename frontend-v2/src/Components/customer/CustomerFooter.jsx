import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Truck, Clock } from 'lucide-react';

const CustomerFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-emerald-600"></div>
              <span className="text-xl font-bold text-white">MediPharm</span>
            </div>
            <p className="text-sm text-slate-400">
              Your trusted online pharmacy for all your healthcare needs.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/medications" className="hover:text-white transition-colors">Medications</Link></li>
              <li><Link to="/prescriptions" className="hover:text-white transition-colors">Prescriptions</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@medipharm.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Health Street, NY</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Secure Payments</p>
                <p className="text-xs text-slate-400">100% Secure & Safe</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <Truck className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Fast Delivery</p>
                <p className="text-xs text-slate-400">Across United States</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">24/7 Support</p>
                <p className="text-xs text-slate-400">Dedicated Support</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} MediPharm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
