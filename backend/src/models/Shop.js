const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '' },
  logo: { type: String, default: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300' },
  banner: { type: String, default: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200' },
  address: { type: String, required: true },
  city: { type: String, default: 'Tiptur' },
  pincode: { type: String, default: '572201' },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  openingHours: { type: String, default: '9:00 AM - 9:00 PM' },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 12 },
  isOpen: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  deliveryRadiusKm: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now }
});

shopSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Shop || mongoose.model('Shop', shopSchema);
