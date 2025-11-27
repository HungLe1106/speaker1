import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add session ID if available
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message || 
                   'Đã xảy ra lỗi';
    
    return Promise.reject(new Error(message));
  }
);

// API functions
export const apiService = {
  // Products
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  checkStock: (items) => api.post('/products/check-stock', { items }),

  // Cart
  getCart: (sessionId) => api.get(`/cart/${sessionId}`),
  addToCart: (sessionId, productId, quantity) => 
    api.post(`/cart/${sessionId}/add`, { productId, quantity }),
  updateCartItem: (sessionId, productId, quantity) =>
    api.put(`/cart/${sessionId}/update`, { productId, quantity }),
  removeFromCart: (sessionId, productId) =>
    api.delete(`/cart/${sessionId}/remove/${productId}`),
  clearCart: (sessionId) => api.delete(`/cart/${sessionId}/clear`),

  // Orders
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getOrders: (filters = {}) => api.get('/orders', { params: filters }),
  updateOrderStatus: (id, status, paymentInfo) =>
    api.put(`/orders/${id}/status`, { status, paymentInfo }),

  // Payment
  createPayment: (orderId, paymentMethod) =>
    api.post('/payment/create', { orderId, paymentMethod }),
  getPaymentMethods: () => api.get('/payment/methods'),
  getPaymentStatus: (orderId) => api.get(`/payment/status/${orderId}`),

  // Health check
  healthCheck: () => api.get('/health')
};

export default api;