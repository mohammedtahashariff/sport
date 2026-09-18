const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['ORDER_STATUS', 'NEW_ORDER', 'LOW_STOCK', 'PROMOTION', 'SYSTEM'],
    default: 'ORDER_STATUS'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: {
    orderId: String,
    productId: String,
    shopId: String,
    status: String
  },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
