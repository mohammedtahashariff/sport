'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { addToast } from '../../../store/toastSlice';
import { api } from '../../../services/api';
import { Store, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    email: '',
    phone: '',
    password: '',
    shopAddress: '',
    city: 'Tiptur',
    pincode: '572201'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.register({
        name: formData.name,
        shopName: formData.shopName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        shopAddress: `${formData.shopAddress}, ${formData.city} - ${formData.pincode}`,
        role: 'seller'
      });

      if (res.success) {
        dispatch(setCredentials({
          user: res.user,
          token: res.token,
          shop: res.shop
        }));
        dispatch(addToast({
          type: 'success',
          title: 'Sports Store Registered! 🏆',
          message: `${formData.shopName} is now active on SportKart`
        }));
        router.push('/seller/dashboard');
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Registration failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 text-white py-12">
      <div className="max-w-xl w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sport-orange to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-orange">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black font-heading text-white">
            Register Your Sports Shop
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Digitize your sports retail store in Tiptur and start receiving local orders today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Suresh Gowda"
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Shop / Store Name *</label>
              <input
                type="text"
                required
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                placeholder="e.g. Chamundeshwari Sports"
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Store Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="store@gmail.com"
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98450 00000"
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Account Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">Shop Street Address *</label>
              <input
                type="text"
                required
                value={formData.shopAddress}
                onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                placeholder="B.H. Road, Opposite Bus Stand..."
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">City / Taluk</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-3 rounded-xl bg-navy-950 border border-navy-700 text-white font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Sports Store...' : 'Complete Merchant Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-navy-800 text-center text-xs text-slate-400">
          Already registered as a seller?{' '}
          <Link href="/seller/login" className="text-sport-orange font-bold hover:underline">
            Sign In to Seller Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
