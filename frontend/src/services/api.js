// Central API Service for SportKart

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sportkart_token');
    if (token) return { Authorization: `Bearer ${token}` };
  }
  return {};
};

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Request failed [${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
        query.append(k, params[k]);
      }
    });
    return request(`/products?${query.toString()}`);
  },
  getProductById: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products/${id}${query ? `?${query}` : ''}`);
  },
  compareProducts: (ids) => request(`/products/compare?ids=${ids.join(',')}`),
  createProduct: (productData) => request('/products', { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Shops
  getShops: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/shops${query ? `?${query}` : ''}`);
  },
  getNearbyShops: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/shops/nearby?${query}`);
  },
  getShopById: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/shops/${id}${query ? `?${query}` : ''}`);
  },
  updateShop: (id, shopData) => request(`/shops/${id}`, { method: 'PUT', body: JSON.stringify(shopData) }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => request(`/orders/${id}`),
  updateOrderStatus: (id, statusData) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),

  // Seller
  getSellerDashboard: () => request('/seller/dashboard'),
  getSellerInventory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/seller/inventory${query ? `?${query}` : ''}`);
  },
  updateQuickStock: (id, stockData) => request(`/seller/inventory/${id}/stock`, { method: 'PUT', body: JSON.stringify(stockData) }),
  getSellerOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/seller/orders${query ? `?${query}` : ''}`);
  },

  // Recommendations & Reviews
  getRecommendations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/recommendations${query ? `?${query}` : ''}`);
  },
  getReviews: (productId) => request(`/reviews?productId=${productId}`),
  addReview: (reviewData) => request('/reviews', { method: 'POST', body: JSON.stringify(reviewData) }),
  getNotifications: () => request('/reviews/notifications'),
  markNotificationRead: (id) => request(`/reviews/notifications/${id}/read`, { method: 'PUT' })
};
