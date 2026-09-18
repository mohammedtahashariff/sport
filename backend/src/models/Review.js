const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, default: 'Sports Fan' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
