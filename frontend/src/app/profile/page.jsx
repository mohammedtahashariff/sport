'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, logout } from '../../store/authSlice';
import { addToast } from '../../store/toastSlice';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import {
  User,
  MapPin,
  PackageCheck,
  Heart,
  Sparkles,
  LogOut,
  Save,
  Plus,
  ShieldCheck,
  Check
} from 'lucide-react';

const SPORTS_OPTIONS = ['Cricket', 'Football', 'Badminton', 'Fitness', 'Running', 'Basketball', 'Volleyball', 'Tennis'];

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    preferredCategories: user?.preferredCategories || ['Cricket', 'Badminton']
  });

  const [addresses, setAddresses] = useState(user?.addresses || [
    {
      id: 'addr-1',
      label: 'Home (Tiptur)',
      fullName: user?.name || 'Ramesh Kumar',
      phone: user?.phone || '+91 98450 12345',
      addressLine: 'Near Vidya Mandir, K.R. Extension, 3rd Cross',
      city: 'Tiptur',
      state: 'Karnataka',
      pincode: '572201',
      isDefault: true
    }
  ]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        preferredCategories: user.preferredCategories || ['Cricket', 'Badminton']
      });
      if (user.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  const toggleCategory = (cat) => {
    const list = [...formData.preferredCategories];
    const idx = list.indexOf(cat);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(cat);
    }
    setFormData({ ...formData, preferredCategories: list });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateProfile({
        name: formData.name,
        phone: formData.phone,
        preferredCategories: formData.preferredCategories,
        addresses
      });

      if (res.success) {
        dispatch(updateUser(res.user));
        dispatch(addToast({ type: 'success', message: 'Profile & Sports Preferences updated!' }));
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to update profile' }));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-black text-slate-900 font-heading mb-8">Customer Profile & Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sport-orange to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-glow-orange">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 leading-tight">{user?.name || 'Ramesh Kumar'}</h3>
                <p className="text-xs text-slate-400">{user?.email || 'customer@sportkart.com'}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10px] font-bold">
                  Verified Local Player
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs font-bold">
              <Link
                href="/orders"
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <PackageCheck className="w-4 h-4 text-sport-orange" />
                  <span>My Orders & Tracking</span>
                </div>
              </Link>

              <Link
                href="/wishlist"
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Saved Wishlist</span>
                </div>
              </Link>

              <Link
                href="/recommendations"
                className="w-full flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-sport-orange" />
                  <span>AI Gear Recommendations</span>
                </div>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'customer@sportkart.com'}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono"
                  />
                </div>
              </div>

              {/* Sports Interest Affinities */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 mb-2">My Favorite Sports (Used for AI Personalization)</h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Select sports you play to receive tailored equipment recommendations from Tiptur stores.
                </p>
                <div className="flex flex-wrap gap-2">
                  {SPORTS_OPTIONS.map((sport) => {
                    const isSelected = formData.preferredCategories.includes(sport);
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => toggleCategory(sport)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-sport-orange text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        <span>{sport}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 mb-3">Saved Delivery Addresses in Tiptur</h4>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{addr.label}</span>
                        <p className="text-slate-600 mt-0.5">{addr.addressLine}, {addr.city} - {addr.pincode}</p>
                        <span className="text-[11px] text-slate-400">Phone: {addr.phone}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        Default
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 bg-navy-900 hover:bg-sport-orange text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Profile & Preferences'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
