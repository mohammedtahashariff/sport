'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { setShop } from '../../../store/authSlice';
import { addToast } from '../../../store/toastSlice';
import SellerHeader from '../../../components/seller/SellerHeader';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  Save,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function SellerProfilePage() {
  const dispatch = useDispatch();
  const { user, shop } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: shop?.name || 'Chamundeshwari Sports Center',
    description: shop?.description || '',
    phone: shop?.phone || '+91 98451 22345',
    email: shop?.email || 'seller@sportkart.com',
    address: shop?.address || 'B.H. Road, Opposite Bus Stand, Tiptur',
    city: shop?.city || 'Tiptur',
    pincode: shop?.pincode || '572201',
    openingHours: shop?.openingHours || '8:30 AM - 9:30 PM',
    deliveryRadiusKm: shop?.deliveryRadiusKm || 15,
    logo: shop?.logo || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300',
    banner: shop?.banner || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200',
    lat: 13.2575,
    lng: 76.4782
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shop) {
      const coords = shop.location?.coordinates || [76.4782, 13.2575];
      setFormData({
        name: shop.name || '',
        description: shop.description || '',
        phone: shop.phone || '',
        email: shop.email || '',
        address: shop.address || '',
        city: shop.city || 'Tiptur',
        pincode: shop.pincode || '572201',
        openingHours: shop.openingHours || '8:30 AM - 9:30 PM',
        deliveryRadiusKm: shop.deliveryRadiusKm || 15,
        logo: shop.logo || '',
        banner: shop.banner || '',
        lat: coords[1],
        lng: coords[0]
      });
    }
  }, [shop]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shopId = shop?.id || user?.shopId || 'shop-1';

    try {
      setSaving(true);
      const res = await api.updateShop(shopId, {
        name: formData.name,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        openingHours: formData.openingHours,
        deliveryRadiusKm: parseInt(formData.deliveryRadiusKm, 10),
        logo: formData.logo,
        banner: formData.banner,
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
        }
      });

      if (res.success) {
        dispatch(setShop(res.shop));
        dispatch(addToast({
          type: 'success',
          title: 'Store Profile Updated! 🏬',
          message: 'Changes published to SportKart customer discovery map'
        }));
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to update shop' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SellerHeader
        title="Shop Profile & GPS Location"
        subtitle="Manage store operating hours, storefront branding, and coordinates"
      />

      <main className="p-8 max-w-4xl space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sport-orange/10 text-sport-orange flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">Store Branding & Details</h3>
                <p className="text-[11px] text-slate-400">Displayed on the customer marketplace</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-xl flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Retailer
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store Description</label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              ></textarea>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Shop Contact Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                placeholder="e.g. 8:30 AM - 9:30 PM"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                value={formData.deliveryRadiusKm}
                onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City / Taluk</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            {/* GPS Latitude and Longitude */}
            <div className="md:col-span-2 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sport-orange" />
                <span>Geospatial GPS Coordinates for Map Pinning</span>
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude (e.g. 13.2575)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude (e.g. 76.4782)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Banner and Logo URLs */}
            <div className="md:col-span-2 pt-4 border-t border-slate-100">
              <label className="block font-bold text-slate-700 mb-1">Store Banner Image URL</label>
              <input
                type="url"
                value={formData.banner}
                onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store Logo Image URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-sport-orange hover:bg-sport-orangeHover text-white font-bold text-xs rounded-2xl shadow-glow-orange flex items-center gap-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Store Profile'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
