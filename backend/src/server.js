require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Store io instance for route controllers
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io Real-time connection handlers
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Join user private room
  socket.on('join_user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined room user_${userId}`);
    }
  });

  // Join seller shop room
  socket.on('join_shop', (shopId) => {
    if (shopId) {
      socket.join(`shop_${shopId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined room shop_${shopId}`);
    }
  });

  // Join specific order room for live tracking
  socket.on('join_order', (orderId) => {
    if (orderId) {
      socket.join(`order_${orderId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined live tracking for order_${orderId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'SportKart Hyperlocal Sports API',
    location: 'Tiptur, Karnataka',
    timestamp: new Date()
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`
=====================================================
  🏆 SPORTKART HYPERLOCAL SPORTS ENGINE RUNNING
  🚀 Server: http://localhost:${PORT}
  📍 Default Location: Tiptur, Karnataka (13.2575° N, 76.4782° E)
  ⚡ Socket.io: Active on port ${PORT}
=====================================================
    `);
  });
});
