import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
// REMOVE: import { AuthProvider } from './context/AuthContext'; // DELETE THIS LINE

// Customer Pages
import CustomerLogin from './Pages/CustomerLogin';
import CustomerHome from './Pages/CustomerHome';
import CustomerRegister from './Pages/CustomerRegister';
import CustomerMedications from './Pages/CustomerMedications';
import CustomerMedicationDetails from './Pages/CustomerMedicationDetails';
import CustomerPrescriptions from './Pages/CustomerPrescriptions';
import CustomerCart from './Pages/CustomerCart';
import CustomerCheckout from './Pages/CustomerCheckout';
import CustomerOrders from './Pages/CustomerOrders';
import CustomerOrderTracking from './Pages/CustomerOrderTracking';
import OrderSuccess from './Pages/OrderSuccess';
import CustomerProfile from './Pages/CustomerProfile';

// Pharmacist Pages
import PharmacistDashboard from './Pages/PharmacistDashboard';
import PharmacistInventory from './Pages/PharmacistInventory';
import PharmacistAddMedication from './Pages/PharmacistAddMedication';
import PharmacistEditMedication from './Pages/PharmacistEditMedication';
import PharmacistPrescriptions from './Pages/PharmacistPrescriptions';
import PharmacistOrders from './Pages/PharmacistOrders';
import PharmacistCustomers from './Pages/PharmacistCustomers';
import PharmacistAnalytics from './Pages/PharmacistAnalytics';
import PharmacistSettings from './Pages/PharmacistSettings';
import PharmacistProfile from './Pages/PharmacistProfile';

// Admin Pages
import AdminDashboard from './Pages/AdminDashboard';
import AdminPharmacies from './Pages/AdminPharmacies';
import AdminAddPharmacy from './Pages/AdminAddPharmacy';
import AdminEditPharmacy from './Pages/AdminEditPharmacy';
import AdminPharmacyStats from './Pages/AdminPharmacyStats';
import AdminPharmacists from './Pages/AdminPharmacists';
import AdminAddPharmacist from './Pages/AdminAddPharmacist';
import AdminMedications from './Pages/AdminMedications';
import AdminOrders from './Pages/AdminOrders';
import AdminUsers from './Pages/AdminUsers';
import AdminAnalytics from './Pages/AdminAnalytics';
import AdminSettings from './Pages/AdminSettings';

function App() {
  // Check if user is logged in and get user role
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    return token && userData;
  };

  const getUserRole = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.role;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // Root route handler
  const RootRoute = () => {
    if (isLoggedIn()) {
      const userRole = getUserRole();
      
      if (userRole === 'pharmacist') {
        return <Navigate to="/pharmacist" replace />;
      } else if (userRole === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      return <CustomerHome />;
    }
    
    return <CustomerHome />;
  };

  return (
    // WRAP ONLY WITH CART PROVIDER
    <CartProvider>
      <Router>
        <Routes>
          {/* ========== ROOT ROUTE ========== */}
          <Route path="/" element={<RootRoute />} />
          
          {/* ========== CUSTOMER ROUTES ========== */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/medications" element={<CustomerMedications />} />
          <Route path="/medications/:id" element={<CustomerMedicationDetails />} />
          <Route path="/prescriptions" element={<CustomerPrescriptions />} />
          <Route path="/cart" element={<CustomerCart />} />
          <Route path="/checkout" element={<CustomerCheckout />} />
          <Route path="/orders" element={<CustomerOrders />} />
          <Route path="/orders/:id" element={<CustomerOrderTracking />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/profile" element={<CustomerProfile />} />
          
          {/* ========== PHARMACIST ROUTES ========== */}
          <Route path="/pharmacist" element={<PharmacistDashboard />} />
          <Route path="/pharmacist/inventory" element={<PharmacistInventory />} />
          <Route path="/pharmacist/add-medication" element={<PharmacistAddMedication />} />
          <Route path="/pharmacist/edit-medication/:id" element={<PharmacistEditMedication />} />
          <Route path="/pharmacist/prescriptions" element={<PharmacistPrescriptions />} />
          <Route path="/pharmacist/orders" element={<PharmacistOrders />} />
          <Route path="/pharmacist/customers" element={<PharmacistCustomers />} />
          <Route path="/pharmacist/analytics" element={<PharmacistAnalytics />} />
          <Route path="/pharmacist/settings" element={<PharmacistSettings />} />
          <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
          
          {/* ========== ADMIN ROUTES ========== */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/pharmacies" element={<AdminPharmacies />} />
          <Route path="/admin/pharmacies/add" element={<AdminAddPharmacy />} />
          <Route path="/admin/pharmacies/edit/:id" element={<AdminEditPharmacy />} />
          <Route path="/admin/pharmacies/stats/:id" element={<AdminPharmacyStats />} />
          <Route path="/admin/pharmacists" element={<AdminPharmacists />} />
          <Route path="/admin/pharmacists/add" element={<AdminAddPharmacist />} />
          <Route path="/admin/medications" element={<AdminMedications />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* ========== CATCH-ALL ROUTE ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;