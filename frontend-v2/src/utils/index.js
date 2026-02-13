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
    
    // Pharmacist Routes
    'PharmacistDashboard': '/pharmacist',
    'PharmacistInventory': '/pharmacist/inventory',
    'PharmacistAddMedication': '/pharmacist/add-medication',
    'PharmacistEditMedication': '/pharmacist/edit-medication',
    'PharmacistOrders': '/pharmacist/orders',
    'PharmacistCustomers': '/pharmacist/customers',
    'PharmacistPrescriptions': '/pharmacist/prescriptions',
    'PharmacistAnalytics': '/pharmacist/analytics',
    'PharmacistSettings': '/pharmacist/settings',
    'PharmacistProfile': '/pharmacist/profile',
    
    // Customer Routes - ADD THE MISSING ONES!
    'CustomerHome': '/',
    'CustomerMedications': '/medications',
    'CustomerMedicationDetails': '/medications', 
    'CustomerProfile': '/profile',
    'CustomerOrders': '/orders',
    'CustomerCart': '/cart',
    'CustomerCheckout': '/checkout',
    'CustomerLogin': '/login',
    'CustomerRegister': '/register',
    'CustomerPrescriptions': '/prescriptions',
    'CustomerPrescriptionUpload': '/prescriptions/upload', 
    'CustomerOrderTracking': '/orders', 
    'OrderSuccess': '/order-success',
    'ChatbotPage': '/chatbot',
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
