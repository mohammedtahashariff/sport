'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../store/authSlice';
import { addToast } from '../../../store/toastSlice';
import { api } from '../../../services/api';
import { Zap, Store, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SellerLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('seller@sportkart.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      const res = await api.login({ email, password, role: 'seller' });
      if (res.success) {
        dispatch(setCredentials({
          user: res.user,
          token: res.token,
          shop: res.shop
        }));
        dispatch(addToast({
          type: 'success',
          title: 'Store Owner Portal 🏆',
          message: `Logged in as ${res.user.name}`
        }));
        router.push('/seller/dashboard');
      }
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        title: 'Merchant Login Failed',
        message: err.message || 'Invalid seller credentials'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 text-white">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sport-orange/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-navy-900 border border-navy-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sport-orange to-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-orange">
            <Store className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-white">
            SPORT<span className="text-sport-orange">KART</span> Merchant
          </h1>
          <p className="text-xs text-slate-400 mt-1">Retailer Portal for Local Sports Shops in Tiptur</p>
        </div>

        {/* 1-Click Demo Shortcut */}
        <div className="p-4 rounded-2xl bg-navy-950 border border-navy-700/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            ⚡ Quick Demo Seller Account
          </span>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2.5 bg-sport-orange/20 hover:bg-sport-orange/30 border border-sport-orange/40 text-amber-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Click to Sign In as Suresh Gowda (Chamundeshwari Sports)</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Store Owner Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@sportkart.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-navy-700 text-white focus:border-sport-orange focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Opening Merchant Portal...' : 'Access Seller Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-navy-800 text-center space-y-2 text-xs">
          <p className="text-slate-400">
            Want to register a new sports store?{' '}
            <Link href="/seller/register" className="text-sport-orange font-bold hover:underline">
              Register Shop Here
            </Link>
          </p>
          <p className="text-slate-400">
            <Link href="/" className="text-slate-500 hover:text-slate-300">
              &larr; Back to Customer Website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
