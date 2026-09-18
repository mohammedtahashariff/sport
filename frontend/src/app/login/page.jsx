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
import { Zap, Lock, Mail, Store, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      const res = await api.login({ email, password });
      if (res.success) {
        dispatch(setCredentials({
          user: res.user,
          token: res.token,
          shop: res.shop
        }));
        dispatch(addToast({
          type: 'success',
          title: `Welcome back, ${res.user.name.split(' ')[0]}! 🏆`,
          message: 'Signed in successfully to SportKart'
        }));

        if (res.user.role === 'seller') {
          router.push('/seller/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message || 'Invalid credentials'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'customer') {
      setEmail('customer@sportkart.com');
      setPassword('password123');
      // trigger login
      setTimeout(() => {
        api.login({ email: 'customer@sportkart.com', password: 'password123' }).then(res => {
          if (res.success) {
            dispatch(setCredentials({ user: res.user, token: res.token, shop: res.shop }));
            dispatch(addToast({ type: 'success', title: 'Logged in as Demo Customer 🛒', message: 'Ramesh Kumar' }));
            router.push('/');
          }
        });
      }, 100);
    } else {
      setEmail('seller@sportkart.com');
      setPassword('password123');
      setTimeout(() => {
        api.login({ email: 'seller@sportkart.com', password: 'password123' }).then(res => {
          if (res.success) {
            dispatch(setCredentials({ user: res.user, token: res.token, shop: res.shop }));
            dispatch(addToast({ type: 'success', title: 'Logged in as Shop Owner 🏬', message: 'Chamundeshwari Sports' }));
            router.push('/seller/dashboard');
          }
        });
      }, 100);
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
            <h1 className="text-2xl font-black text-slate-900 font-heading">Welcome Back</h1>
            <p className="text-xs text-slate-500 mt-1">Sign in to your SportKart account</p>
          </div>

          {/* Quick Demo 1-Click Login Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              ⚡ Instant 1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-sport-orange" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('seller')}
                className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Store Owner</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@sportkart.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
            <p className="text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-sport-orange font-bold hover:underline">
                Create Customer Account
              </Link>
            </p>
            <p className="text-slate-500">
              Own a sports store?{' '}
              <Link href="/seller/register" className="text-navy-900 font-bold hover:underline">
                Register Your Sports Shop
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
