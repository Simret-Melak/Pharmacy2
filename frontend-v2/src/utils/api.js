// @/utils/api.js - Complete API Utility
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Enhanced fetch with timeout and retry logic
const enhancedFetch = async (url, options = {}, retries = 3) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry logic for network errors
    if (retries > 0 && (error.name === 'AbortError' || error.message.includes('NetworkError'))) {
      console.warn(`Retrying request (${retries} retries left)...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      return enhancedFetch(url, options, retries - 1);
    }
    
    throw error;
  }
};

// Helper function to handle authentication errors
const handleAuthError = (status) => {
  if (status === 401 || status === 403) {
    console.log('🔐 Auth error detected, clearing localStorage');
    // Clear invalid tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    
    // ⚠️ REMOVED the auto-redirect logic
    // Let the component handle the redirect based on the error
    
    return true;
  }
  return false;
};

// Helper function to extract error message
const extractErrorMessage = async (response) => {
  try {
    const errorData = await response.json();
    return errorData.message || `HTTP error! status: ${response.status}`;
  } catch {
    return `HTTP error! status: ${response.status}`;
  }
};

// Main API object with all HTTP methods
export const api = {
  // Generic POST request
  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }
    
    return response.json();
  },

  // FormData POST request (for file uploads)
  postFormData: async (endpoint, formData) => {
    const token = localStorage.getItem('token');
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!response.ok) {
      // Handle auth errors
      if (handleAuthError(response.status)) {
        throw new Error('Authentication failed. Please login again.');
      }
      
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }
    
    return response.json();
  }
};

// Auth-specific API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.success) {
      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.success) {
      // Store tokens and user data
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  logout: async () => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/auth/logout`, {
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
      localStorage.removeItem('cart');
      
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
    
    const response = await enhancedFetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    // Update stored token if refresh was successful
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  // Validate token
  validateToken: async () => {
    try {
      const response = await api.get('/auth/validate');
      return response;
    } catch (error) {
      return { success: false, message: 'Token validation failed' };
    }
  }
};

// User management API (admin only)
export const userAPI = {
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return api.get(`/auth/users${queryString ? `?${queryString}` : ''}`);
  },
  
  promoteUser: async (userId, role) => {
    return api.post(`/auth/users/${userId}/promote`, { role });
  },
  
  demoteUser: async (userId) => {
    return api.post(`/auth/users/${userId}/demote`);
  },
  
  deleteUser: async (userId) => {
    return api.delete(`/auth/users/${userId}`);
  },
  
  getUserById: async (userId) => {
    return api.get(`/auth/users/${userId}`);
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
    const response = await api.put('/profile', profileData);
    
    // Update stored user data if successful
    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return api.post('/profile/change-password', { currentPassword, newPassword });
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
  }
};

// Medication API functions
export const medicationAPI = {
  // Get medications with pagination and filtering
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
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
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
  },
  
  // Get medication categories
  getCategories: async () => {
    return api.get('/medications/categories');
  },
  
  // Get featured medications
  getFeaturedMedications: async (limit = 4) => {
    return api.get(`/medications/featured?limit=${limit}`);
  }
};

// Enhanced Prescription API functions
export const prescriptionAPI = {
  // Upload prescription (using FormData)
  uploadPrescription: async (medicationId, file) => {
    if (!file) {
      throw new Error('No file provided');
    }
    
    const formData = new FormData();
    formData.append('prescription', file);
    
    // Use the postFormData method for file uploads
    return api.postFormData(`/prescriptions/upload/${medicationId}`, formData);
  },
  
  // Get user's prescriptions with pagination and filtering
  getMyPrescriptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    return api.get(`/prescriptions/my-prescriptions${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get prescription details
  getPrescriptionDetails: async (id) => {
    return api.get(`/prescriptions/${id}`);
  },
  
  // View prescription file (returns signed URL)
  viewPrescription: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Generate the view URL with token
    const viewUrl = `${API_BASE_URL}/prescriptions/${id}/view`;
    
    return {
      url: viewUrl,
      method: 'GET'
    };
  },
  
  // Download prescription (returns signed URL)
  downloadPrescription: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    // Generate the download URL with token
    const downloadUrl = `${API_BASE_URL}/prescriptions/${id}/download`;
    
    return {
      url: downloadUrl,
      method: 'GET'
    };
  },
  
  // Delete prescription
  deletePrescription: async (id) => {
    return api.delete(`/prescriptions/${id}`);
  },
  
  // Update prescription status (admin/pharmacist only)
  updatePrescriptionStatus: async (id, status, notes = '') => {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Invalid status. Must be "approved" or "rejected"');
    }
    
    if (status === 'rejected' && !notes.trim()) {
      throw new Error('Rejection notes are required');
    }
    
    return api.patch(`/prescriptions/${id}/status`, { status, notes });
  },
  
  // Get all prescriptions (admin/pharmacist only)
  getAllPrescriptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.userId) queryParams.append('user_id', params.userId);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    
    const queryString = queryParams.toString();
    return api.get(`/prescriptions${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get prescription statistics
  getPrescriptionStats: async () => {
    return api.get('/prescriptions/stats');
  }
};

// Cart API functions
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
  },
  
  // Apply coupon
  applyCoupon: async (couponCode) => {
    return api.post('/cart/coupon', { couponCode });
  },
  
  // Remove coupon
  removeCoupon: async () => {
    return api.delete('/cart/coupon');
  },
  
  // Calculate shipping
  calculateShipping: async (addressId) => {
    return api.post('/cart/shipping', { addressId });
  }
};

// Order API functions
export const orderAPI = {
  // Create order from cart
  createOrder: async (orderData) => {
    return api.post('/orders', orderData);
  },
  
  // Get user's orders
  getMyOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return api.get(`/orders/my-orders${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get order details
  getOrderDetails: async (orderId) => {
    return api.get(`/orders/${orderId}`);
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    return api.post(`/orders/${orderId}/cancel`);
  },
  
  // Track order
  trackOrder: async (orderId) => {
    return api.get(`/orders/${orderId}/track`);
  }
};

// Chatbot API functions
export const chatbotAPI = {
  sendMessage: async (message, sessionId = null) => {
    try {
      const data = { message };
      if (sessionId) {
        data.sessionId = sessionId;
      }
      return await api.post('/chatbot/chat', data);
    } catch (error) {
      console.error('Chatbot sendMessage error:', error);
      
      // Return fallback response
      const fallbackResponses = {
        'hour': "Our store hours are: Monday-Friday 8AM-10PM, Saturday 9AM-8PM, Sunday 10AM-6PM.",
        'deliver': "We offer free delivery within 5km (2-4 hours). For orders outside 5km, delivery fees apply.",
        'prescription': "You can refill prescriptions by: 1) Uploading on our website/app 2) Calling (555) 123-4567 3) Visiting in person.",
        'emergency': "For medical emergencies, call 911 immediately. For urgent pharmacy needs, call (555) 123-4569.",
        'payment': "We accept: Credit/Debit Cards, Insurance, HSA/FSA cards, Cash on delivery.",
        'contact': "Phone: (555) 123-4567\nAddress: 123 Pharmacy Street\nEmail: info@pharmacy.com"
      };

      const lowerMessage = message.toLowerCase();
      let fallbackReply = "I apologize, I'm having trouble connecting right now. Please call us at (555) 123-4567 for assistance.";

      // Check for keywords in the message
      for (const [keyword, response] of Object.entries(fallbackResponses)) {
        if (lowerMessage.includes(keyword)) {
          fallbackReply = response;
          break;
        }
      }

      return {
        success: false,
        reply: fallbackReply + "\n\nNote: I'm an AI assistant. For medical advice, consult a pharmacist.",
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  getSuggestions: async () => {
    try {
      return await api.get('/chatbot/suggestions');
    } catch (error) {
      return {
        success: false,
        suggestions: [
          "What are your store hours?",
          "How do I refill a prescription?",
          "Do you deliver medications?",
          "What payment methods do you accept?",
          "Are you open on weekends?",
          "What should I do in a medication emergency?"
        ]
      };
    }
  },
  
  clearHistory: async (sessionId = null) => {
    try {
      const data = sessionId ? { sessionId } : {};
      return await api.post('/chatbot/clear', data);
    } catch (error) {
      return { success: true, message: 'Local chat history cleared' };
    }
  },
  
  testConnection: async () => {
    try {
      const response = await enhancedFetch(`${API_BASE_URL}/chatbot/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Chatbot service is available' : 'Chatbot service is unavailable'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Cannot connect to chatbot service',
        error: error.message
      };
    }
  }
};

// Utility functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  localStorage.removeItem('chatbot_session');
};

// Chatbot session management
export const getChatbotSession = () => {
  try {
    const session = localStorage.getItem('chatbot_session');
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error parsing chatbot session:', error);
    return null;
  }
};

export const setChatbotSession = (sessionData) => {
  try {
    localStorage.setItem('chatbot_session', JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving chatbot session:', error);
  }
};

export const clearChatbotSession = () => {
  localStorage.removeItem('chatbot_session');
};

// Chatbot message persistence
export const saveChatbotMessages = (messages, sessionId) => {
  try {
    const chatHistory = {
      sessionId,
      messages,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`chatbot_history_${sessionId}`, JSON.stringify(chatHistory));
  } catch (error) {
    console.error('Error saving chatbot messages:', error);
  }
};

export const loadChatbotMessages = (sessionId) => {
  try {
    const history = localStorage.getItem(`chatbot_history_${sessionId}`);
    return history ? JSON.parse(history).messages : [];
  } catch (error) {
    console.error('Error loading chatbot messages:', error);
    return [];
  }
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${formatFileSize(maxSize)}` 
    };
  }

  return { valid: true, error: null };
};

// 👇 Add this chatbotUtils object (if not already present)
export const chatbotUtils = {
  // Generate a unique session ID for chatbot
  generateSessionId: () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  // Check if chatbot is available
  isAvailable: async () => {
    try {
      const response = await chatbotAPI.testConnection();
      return response.success;
    } catch (error) {
      return false;
    }
  },
  
  // Get default welcome message
  getWelcomeMessage: () => {
    return {
      role: 'bot',
      text: "👋 Hello! I'm PharmaBot, your pharmacy assistant. I can help with:\n• Store hours & location\n• Prescription refills\n• Delivery information\n• Payment methods\n• Medication questions\n\nHow can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },
  
  // Get quick suggestion buttons
  getQuickSuggestions: () => {
    return [
      { text: 'Store hours?', icon: '🕐', question: 'What are your store hours?' },
      { text: 'Delivery info?', icon: '🚚', question: 'Do you deliver medications?' },
      { text: 'Prescription refill?', icon: '💊', question: 'How do I refill a prescription?' },
      { text: 'Contact pharmacy?', icon: '📞', question: 'What is your phone number?' },
      { text: 'Payment methods?', icon: '💰', question: 'What payment methods do you accept?' },
      { text: 'Emergency help?', icon: '🚨', question: 'What should I do in a medication emergency?' }
    ];
  },
  
  // Format error message for display
  formatErrorMessage: (error) => {
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      return "I'm having trouble connecting. Please check your internet connection or call us at (555) 123-4567.";
    } else if (error.message.includes('500')) {
      return "Our chatbot service is temporarily unavailable. Please contact us directly at (555) 123-4567.";
    } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
      return "The request timed out. Please try again or call us at (555) 123-4567.";
    } else {
      return "I apologize for the inconvenience. Please try again or call us at (555) 123-4567.";
    }
  },
  
  // Get chatbot configuration
  getConfig: () => {
    return {
      maxMessages: 50,
      sessionTimeout: 60 * 60 * 1000, // 1 hour
      typingDelay: 1000, // 1 second for typing simulation
      quickActions: [
        { icon: '🕐', label: 'Store Hours', question: 'What are your store hours?' },
        { icon: '🚚', label: 'Delivery', question: 'Do you deliver medications?' },
        { icon: '💊', label: 'Prescription', question: 'How do I refill a prescription?' },
        { icon: '📞', label: 'Contact', question: 'What is your contact information?' }
      ]
    };
  },
  
  // Format message for display
  formatMessage: (message) => {
    const timestamp = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return {
      ...message,
      timestamp,
      formattedTime: timestamp
    };
  }
};

// Export all APIs as a single object for convenience
export default {
  api,
  authAPI,
  userAPI,
  profileAPI,
  medicationAPI,
  prescriptionAPI,
  cartAPI,
  orderAPI,
  chatbotAPI,
  chatbotUtils,
  isAuthenticated,
  getCurrentUser,
  setAuthToken,
  clearAuth,
  getChatbotSession,
  setChatbotSession,
  clearChatbotSession,
  saveChatbotMessages,
  loadChatbotMessages,
  formatFileSize,
  validateFile
};