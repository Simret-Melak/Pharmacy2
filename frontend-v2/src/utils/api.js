// Simple API utility for making requests
const API_BASE_URL = 'http://localhost:5001/api';

export const api = {
  // Generic POST request
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Generic GET request with authentication
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Auto-logout on 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Generic DELETE request with authentication
  delete: async (endpoint, data = null) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method: 'DELETE',
      headers
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Generic PUT request
  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  // Generic PATCH request
  patch: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};

// Auth-specific API calls
export const authAPI = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Always clear local storage even if server logout fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  initiateGuestCheckout: async (guestData) => {
    return api.post('/auth/guest/initiate', guestData);
  },
  
  deleteAccount: async (email, password) => {
    return api.delete('/auth/account', { email, password });
  },
  
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    return response.json();
  }
};

// User management API (admin only)
export const userAPI = {
  getAllUsers: async () => {
    return api.get('/auth/users');
  },
  
  promoteUser: async (userId, role) => {
    return api.post(`/auth/users/${userId}/promote`, { role });
  },
  
  demoteUser: async (userId) => {
    return api.post(`/auth/users/${userId}/demote`);
  },
  
  deleteUser: async (userId) => {
    return api.delete(`/auth/users/${userId}`);
  }
};

// Profile API functions
export const profileAPI = {
  // Get current user's profile
  getProfile: async () => {
    return api.get('/profile');
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    return api.put('/profile', profileData);
  },
  
  // Change password
  changePassword: async (passwordData) => {
    return api.post('/profile/change-password', passwordData);
  },
  
  // Address management
  getAddresses: async () => {
    return api.get('/profile/addresses');
  },
  
  addAddress: async (addressData) => {
    return api.post('/profile/addresses', addressData);
  },
  
  updateAddress: async (addressId, addressData) => {
    return api.put(`/profile/addresses/${addressId}`, addressData);
  },
  
  deleteAddress: async (addressId) => {
    return api.delete(`/profile/addresses/${addressId}`);
  },
  
  // Set default address
  setDefaultAddress: async (addressId) => {
    return api.patch(`/profile/addresses/${addressId}/default`);
  },
  
  // Optional - get user orders and prescriptions
  getOrders: async () => {
    return api.get('/profile/orders');
  },
  
  getPrescriptions: async () => {
    return api.get('/profile/prescriptions');
  }
};

// Medication API functions
export const medicationAPI = {
  // Get medications
  getMedications: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.pharmacy_id) queryParams.append('pharmacy_id', params.pharmacy_id);
    if (params.requires_prescription !== undefined) {
      queryParams.append('requires_prescription', params.requires_prescription);
    }
    
    const queryString = queryParams.toString();
    return api.get(`/medications${queryString ? `?${queryString}` : ''}`);
  },
  
  // Search medications
  searchMedications: async (name, limit = 10) => {
    return api.get(`/medications/search?name=${encodeURIComponent(name)}&limit=${limit}`);
  },
  
  // Get medication suggestions (autocomplete)
  getSuggestions: async (query, limit = 10) => {
    return api.get(`/medications/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
  },
  
  // Get medication by ID
  getMedicationById: async (id) => {
    return api.get(`/medications/${id}`);
  },
  
  // Check prescription requirement
  checkPrescriptionRequirement: async (medicationId) => {
    return api.get(`/medications/${medicationId}/prescription-required`);
  }
};

// Prescription API functions
export const prescriptionAPI = {
  // Upload prescription
  uploadPrescription: async (medicationId, formData) => {
    // Note: This needs to handle file upload, so we can't use the standard api.post
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/prescriptions/upload/${medicationId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get user's prescriptions
  getMyPrescriptions: async () => {
    return api.get('/prescriptions/my-prescriptions');
  },
  
  // Get prescription details
  getPrescriptionDetails: async (id) => {
    return api.get(`/prescriptions/${id}`);
  },
  
  // View prescription file
  viewPrescription: async (id) => {
    return api.get(`/prescriptions/${id}/view`);
  },
  
  // Download prescription
  downloadPrescription: async (id) => {
    return api.get(`/prescriptions/${id}/download`);
  },
  
  // Delete prescription
  deletePrescription: async (id) => {
    return api.delete(`/prescriptions/${id}`);
  }
};

// Cart API functions (to be implemented)
export const cartAPI = {
  getCart: async () => {
    return api.get('/cart');
  },
  
  addToCart: async (medicationId, quantity = 1) => {
    return api.post('/cart/items', { medicationId, quantity });
  },
  
  updateCartItem: async (itemId, quantity) => {
    return api.put(`/cart/items/${itemId}`, { quantity });
  },
  
  removeFromCart: async (itemId) => {
    return api.delete(`/cart/items/${itemId}`);
  },
  
  clearCart: async () => {
    return api.delete('/cart');
  },
  
  getCartCount: async () => {
    return api.get('/cart/count');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Set auth headers for future requests
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Clear all auth data
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('cart'); // Also clear cart
};