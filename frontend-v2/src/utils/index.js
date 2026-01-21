// Utility functions for page URLs
export const createPageUrl = (pageName) => {
  const pageMap = {
    // Admin Routes
    'AdminDashboard': '/admin',
    'AdminPharmacies': '/admin/pharmacies',
    'AdminAddPharmacy': '/admin/pharmacies/add',
    'AdminEditPharmacy': '/admin/pharmacies/edit',
    'AdminPharmacyStats': '/admin/pharmacies/stats',
    'AdminPharmacists': '/admin/pharmacists',
    'AdminAddPharmacist': '/admin/pharmacists/add',
    'AdminOrders': '/admin/orders',
    'AdminSettings': '/admin/settings',
    'AdminMedications': '/admin/medications',
    'AdminUsers': '/admin/users',
    'AdminAnalytics': '/admin/analytics',
    
    // Pharmacist Routes - ADD THESE MISSING ROUTES
    'PharmacistDashboard': '/pharmacist',
    'PharmacistInventory': '/pharmacist/inventory',
    'PharmacistAddMedication': '/pharmacist/add-medication',
    'PharmacistEditMedication': '/pharmacist/edit-medication',
    'PharmacistOrders': '/pharmacist/orders',
    'PharmacistCustomers': '/pharmacist/customers',
    'PharmacistPrescriptions': '/pharmacist/prescriptions',
    'PharmacistAnalytics': '/pharmacist/analytics',
    'PharmacistSettings': '/pharmacist/settings',
    'PharmacistProfile': '/pharmacist/profile', // This was missing!
    
    // Customer Routes
    'CustomerHome': '/',
    'CustomerMedications': '/medications',
    'CustomerProfile': '/profile',
    'CustomerOrders': '/orders',
    'CustomerCart': '/cart',
    'CustomerCheckout': '/checkout',
    'CustomerLogin': '/login',
    'CustomerRegister': '/register',
    'CustomerPrescriptions': '/prescriptions',
    'CustomerOrderTracking': '/orders',
    'OrderSuccess': '/order-success',
  };
  
  return pageMap[pageName] || '/';
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};
