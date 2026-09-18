// Intelligent In-Memory Store & State Engine with complete CRUD, geospatial and filtering support
const { seedShops, seedProducts, seedUsers, seedOrders, seedReviews } = require('../config/seedData');

class MemoryStore {
  constructor() {
    this.shops = JSON.parse(JSON.stringify(seedShops));
    this.products = JSON.parse(JSON.stringify(seedProducts));
    this.users = JSON.parse(JSON.stringify(seedUsers));
    this.orders = JSON.parse(JSON.stringify(seedOrders));
    this.reviews = JSON.parse(JSON.stringify(seedReviews));
    this.notifications = [
      {
        id: "notif-1",
        userId: "user-1",
        type: "ORDER_STATUS",
        title: "Order Out for Delivery! 🚚",
        message: "Your order #SK-TIP-8921 is out for delivery. Rider is heading to K.R. Extension.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: "notif-2",
        userId: "user-2",
        type: "NEW_ORDER",
        title: "New Local Order Received 🛒",
        message: "Order #SK-TIP-8921 received for SG Test Pro Batting Gloves.",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      }
    ];
  }

  // --- SHOPS ---
  getShops() {
    return this.shops;
  }

  getShopById(id) {
    return this.shops.find(s => s.id === id || s._id?.toString() === id);
  }

  updateShop(id, updateData) {
    const index = this.shops.findIndex(s => s.id === id || s._id?.toString() === id);
    if (index !== -1) {
      this.shops[index] = { ...this.shops[index], ...updateData, updatedAt: new Date() };
      return this.shops[index];
    }
    return null;
  }

  createShop(shopData) {
    const newShop = {
      id: `shop-${Date.now()}`,
      ...shopData,
      rating: 5.0,
      reviewCount: 1,
      isOpen: true,
      isVerified: true,
      createdAt: new Date()
    };
    this.shops.unshift(newShop);
    return newShop;
  }

  // --- PRODUCTS ---
  getProducts(filters = {}) {
    let list = [...this.products];

    if (filters.category && filters.category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.brand && filters.brand !== 'All') {
      list = list.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    if (filters.shopId) {
      list = list.filter(p => p.shopId === filters.shopId);
    }

    if (filters.minPrice) {
      list = list.filter(p => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      list = list.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.inStock === 'true' || filters.inStock === true) {
      list = list.filter(p => p.stock > 0);
    }

    if (filters.minRating) {
      list = list.filter(p => p.rating >= parseFloat(filters.minRating));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Attach shop info to each product
    list = list.map(p => {
      const shop = this.getShopById(p.shopId);
      return {
        ...p,
        shopName: shop ? shop.name : "Local Sports Hub",
        shopCity: shop ? shop.city : "Tiptur",
        shopRating: shop ? shop.rating : 4.5,
        shopAddress: shop ? shop.address : "Tiptur Main Road"
      };
    });

    // Sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          list.reverse();
          break;
        default:
          // relevance
          break;
      }
    }

    return list;
  }

  getProductById(id) {
    const prod = this.products.find(p => p.id === id || p._id?.toString() === id);
    if (!prod) return null;
    const shop = this.getShopById(prod.shopId);
    return {
      ...prod,
      shopName: shop ? shop.name : "Local Sports Hub",
      shopAddress: shop ? shop.address : "Tiptur",
      shopPhone: shop ? shop.phone : "+91 98451 22345",
      shopRating: shop ? shop.rating : 4.5
    };
  }

  addProduct(productData) {
    const newProd = {
      id: `prod-${Date.now()}`,
      ...productData,
      rating: 4.5,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.unshift(newProd);
    return newProd;
  }

  updateProduct(id, updateData) {
    const index = this.products.findIndex(p => p.id === id || p._id?.toString() === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updateData, updatedAt: new Date() };
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id || p._id?.toString() === id);
    if (index !== -1) {
      const deleted = this.products.splice(index, 1);
      return deleted[0];
    }
    return null;
  }

  // --- USERS & AUTH ---
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u.id === id || u._id?.toString() === id);
  }

  createUser(userData) {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: userData.role || 'customer',
      addresses: userData.addresses || [],
      preferredCategories: userData.preferredCategories || ['Cricket', 'Badminton'],
      browsingHistory: [],
      searchHistory: [],
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updateData) {
    const index = this.users.findIndex(u => u.id === id || u._id?.toString() === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updateData };
      return this.users[index];
    }
    return null;
  }

  // --- ORDERS ---
  getOrders(filters = {}) {
    let list = [...this.orders];
    if (filters.userId) {
      list = list.filter(o => o.userId === filters.userId);
    }
    if (filters.shopId) {
      list = list.filter(o => o.shopId === filters.shopId);
    }
    if (filters.status && filters.status !== 'All') {
      list = list.filter(o => o.orderStatus.toLowerCase() === filters.status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id || o._id?.toString() === id || o.orderNumber === id);
  }

  createOrder(orderData) {
    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `SK-TIP-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      orderStatus: "Order Placed",
      statusTimeline: [
        {
          status: "Order Placed",
          timestamp: new Date(),
          note: `Order placed via ${orderData.paymentMethod || 'COD'}`
        }
      ],
      estimatedDeliveryTime: "25-40 mins",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Deduct stock
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach(item => {
        const prod = this.getProductById(item.productId);
        if (prod && prod.stock >= item.quantity) {
          this.updateProduct(item.productId, { stock: prod.stock - item.quantity });
        }
      });
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(id, newStatus, note = "") {
    const order = this.getOrderById(id);
    if (!order) return null;

    order.orderStatus = newStatus;
    order.updatedAt = new Date();
    if (!order.statusTimeline) order.statusTimeline = [];

    order.statusTimeline.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${newStatus}`
    });

    return order;
  }

  // --- REVIEWS ---
  getReviewsByProduct(productId) {
    return this.reviews.filter(r => r.productId === productId);
  }

  addReview(reviewData) {
    const newRev = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      createdAt: new Date()
    };
    this.reviews.unshift(newRev);
    return newRev;
  }

  // --- NOTIFICATIONS ---
  getNotifications(userId) {
    return this.notifications
      .filter(n => !n.userId || n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addNotification(notifData) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      ...notifData,
      read: false,
      createdAt: new Date()
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  markNotificationRead(id) {
    const n = this.notifications.find(item => item.id === id);
    if (n) n.read = true;
    return n;
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
