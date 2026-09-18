'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Package } from 'lucide-react';

const CATEGORIES = [
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
];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  product = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cricket',
    brand: '',
    price: '',
    discount: 0,
    stock: 10,
    sku: '',
    description: '',
    image: '',
    material: '',
    weight: '',
    size: '',
    color: '',
    warranty: 'Brand Warranty'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Cricket',
        brand: product.brand || '',
        price: product.price || '',
        discount: product.discount || 0,
        stock: product.stock || 10,
        sku: product.sku || '',
        description: product.description || '',
        image: (product.images && product.images[0]) || product.image || '',
        material: product.specifications?.material || '',
        weight: product.specifications?.weight || '',
        size: product.specifications?.size || '',
        color: product.specifications?.color || '',
        warranty: product.specifications?.warranty || 'Brand Warranty'
      });
    } else {
      setFormData({
        name: '',
        category: 'Cricket',
        brand: '',
        price: '',
        discount: 0,
        stock: 10,
        sku: `SK-${Math.floor(100000 + Math.random() * 900000)}`,
        description: '',
        image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
        material: 'Premium Sports Grade',
        weight: 'Standard',
        size: 'Full Size',
        color: 'Standard',
        warranty: '6 Months Manufacturer Warranty'
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      category: formData.category,
      brand: formData.brand,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount || 0),
      stock: parseInt(formData.stock || 10, 10),
      sku: formData.sku,
      description: formData.description,
      images: [formData.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800"],
      specifications: {
        material: formData.material,
        weight: formData.weight,
        size: formData.size,
        color: formData.color,
        warranty: formData.warranty
      }
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sport-orange/20 text-sport-orange flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {product ? 'Edit Sports Product' : 'Add New Sports Product'}
              </h3>
              <p className="text-xs text-slate-400">Save to your local Tiptur shop catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. SS Master 5000 English Willow Cricket Bat"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. SS, Yonex, Nivia"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (₹ INR) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1999"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount %</label>
              <input
                type="number"
                min="0"
                max="90"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="10"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Stock Count *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU / Item Code</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SS-BAT-001"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe key features, playability, grade, and suitable court/pitch surfaces..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              ></textarea>
            </div>

            {/* Specs */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. English Willow / Carbon Graphite"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Weight</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g. 1180g / 4U 83g"
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sport-orange hover:bg-sport-orangeHover text-white font-bold transition-all shadow-glow-orange flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{product ? 'Update Product' : 'Save to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
