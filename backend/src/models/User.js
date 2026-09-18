const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', default: null },
  addresses: [{
    label: { type: String, default: 'Home' },
    fullName: String,
    phone: String,
    addressLine: String,
    city: { type: String, default: 'Tiptur' },
    state: { type: String, default: 'Karnataka' },
    pincode: { type: String, default: '572201' },
    isDefault: { type: Boolean, default: false },
    location: {
      lat: Number,
      lng: Number
    }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  browsingHistory: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    category: String,
    viewedAt: { type: Date, default: Date.now }
  }],
  searchHistory: [{
    query: String,
    searchedAt: { type: Date, default: Date.now }
  }],
  preferredCategories: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
