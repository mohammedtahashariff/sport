const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  subtotal: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  deliveryAddress: {
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number
  },
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'COD'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: [
      'Order Placed',
      'Seller Accepted',
      'Preparing',
      'Packed',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'Order Placed'
  },
  statusTimeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  estimatedDeliveryTime: { type: String, default: '30-45 mins' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
