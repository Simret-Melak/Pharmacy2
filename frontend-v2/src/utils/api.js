// Simple API utility for making requests
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, config);
    
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
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
    
    const response = await enhancedFetch(`${API_BASE_URL}${endpoint}`, {
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
    
    const response = await enhancedFetch(`${API_BASE_URL}/prescriptions/upload/${medicationId}`, {
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

// 👇 ENHANCED Chatbot API functions
export const chatbotAPI = {
  // Send message to chatbot with better error handling
  sendMessage: async (message, sessionId = null) => {
    try {
      const data = { message };
      if (sessionId) {
        data.sessionId = sessionId;
      }
      return await api.post('/chatbot/chat', data);
    } catch (error) {
      console.error('Chatbot sendMessage error:', error);
      
      // Return a fallback response if API fails
      const fallbackResponses = {
        'store hours': "Our store hours are: Monday-Friday 8AM-10PM, Saturday 9AM-8PM, Sunday 10AM-6PM.",
        'delivery': "We offer free delivery within 5km (2-4 hours). For orders outside 5km, delivery fees apply.",
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
  
  // Get quick suggestions
  getSuggestions: async () => {
    try {
      return await api.get('/chatbot/suggestions');
    } catch (error) {
      console.error('Chatbot suggestions error:', error);
      // Return default suggestions
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
  
  // Clear chat history
  clearHistory: async (sessionId = null) => {
    try {
      const data = sessionId ? { sessionId } : {};
      return await api.post('/chatbot/clear', data);
    } catch (error) {
      console.error('Chatbot clear history error:', error);
      // Still return success for local clearing
      return { success: true, message: 'Local chat history cleared' };
    }
  },
  
  // Test chatbot connection
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
  },
  
  // Quick action messages
  quickActions: {
    storeHours: async () => {
      return chatbotAPI.sendMessage('What are your store hours?');
    },
    
    deliveryInfo: async () => {
      return chatbotAPI.sendMessage('Do you deliver medications? What are the delivery options?');
    },
    
    prescriptionRefill: async () => {
      return chatbotAPI.sendMessage('How do I refill a prescription?');
    },
    
    contactInfo: async () => {
      return chatbotAPI.sendMessage('What is your phone number and address?');
    },
    
    emergencyInfo: async () => {
      return chatbotAPI.sendMessage('What should I do in a medication emergency?');
    },
    
    paymentMethods: async () => {
      return chatbotAPI.sendMessage('What payment methods do you accept?');
    }
  }
};

// 👇 ENHANCED Utility functions for chatbot integration
export const chatbotUtils = {
  // Generate a unique session ID for chatbot
  generateSessionId: () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  // Check if chatbot is available (backend running)
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
  localStorage.removeItem('chatbot_session'); // Also clear chatbot session
};

// 👇 ENHANCED FUNCTIONS: Store and retrieve chatbot session
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

// 👇 NEW: Chatbot persistence functions
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

// Export all APIs as a single object for convenience (optional)
export default {
  api,
  authAPI,
  userAPI,
  profileAPI,
  medicationAPI,
  prescriptionAPI,
  cartAPI,
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
  loadChatbotMessages
};