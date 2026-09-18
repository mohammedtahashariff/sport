'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { addToast } from '../../store/toastSlice';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import { Zap, User, Mail, Lock, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(addToast({ type: 'error', message: 'Passwords do not match' }));
      return;
    }

    try {
      setLoading(true);
      const res = await api.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'customer'
      });

      if (res.success) {
        dispatch(setCredentials({ user: res.user, token: res.token, shop: null }));
        dispatch(addToast({ type: 'success', title: 'Welcome to SportKart! 🏆', message: 'Account registered successfully' }));
        router.push('/');
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Registration failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-12 w-full flex flex-col justify-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sport-orange to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-orange">
              <Zap className="w-6 h-6 fill-white stroke-none" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-heading">Create Account</h1>
            <p className="text-xs text-slate-500 mt-1">Join SportKart for 30-min local sports deliveries in Tiptur</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98450 12345"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link href="/login" className="text-sport-orange font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
