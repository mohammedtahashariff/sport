const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Cricket',
      'Football',
      'Badminton',
      'Basketball',
      'Volleyball',
      'Tennis',
      'Fitness',
      'Running',
      'Gym Accessories',
      'Sports Shoes',
      'Sports Clothing',
      'Accessories'
    ]
  },
  brand: { type: String, required: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 }, // percentage
  originalPrice: { type: Number },
  stock: { type: Number, default: 10 },
  lowStockThreshold: { type: Number, default: 5 },
  sku: { type: String, default: '' },
  specifications: {
    material: String,
    weight: String,
    size: String,
    color: String,
    idealFor: String,
    warranty: String,
    inTheBox: String
  },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 8 },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

productSchema.index({ name: 'text', brand: 'text', description: 'text', category: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
