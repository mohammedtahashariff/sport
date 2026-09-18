'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setLocationModalOpen } from '../../store/locationSlice';
import { logout } from '../../store/authSlice';
import {
  Zap,
  MapPin,
  Search,
  Heart,
  ShoppingCart,
  User,
  Store,
  ChevronDown,
  Sparkles,
  LogOut,
  PackageCheck,
  Scale,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { city, radius } = useSelector((state) => state.location);
  const { totalItems, grandTotal } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const comparisonItems = useSelector((state) => state.comparison.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const categories = [
    { name: 'Cricket', icon: '🏏' },
    { name: 'Football', icon: '⚽' },
    { name: 'Badminton', icon: '🏸' },
    { name: 'Fitness & Gym', icon: '💪' },
    { name: 'Running', icon: '🏃' },
    { name: 'Basketball', icon: '🏀' },
    { name: 'Volleyball', icon: '🏐' },
    { name: 'Tennis', icon: '🎾' },
    { name: 'Sports Shoes', icon: '👟' },
    { name: 'Accessories', icon: '🎒' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white border-b border-navy-700/60 shadow-lg">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-sport-orange to-amber-600 px-4 py-1.5 text-xs font-semibold text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-extrabold">Hyperlocal Delivery</span>
            <span>⚡ Express sports gear delivery in 30-45 minutes across Tiptur & surrounding taluks!</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <Link href="/about" className="hover:underline">About SportKart</Link>
            <span>•</span>
            <Link href="/seller/login" className="flex items-center gap-1 hover:text-navy-950 transition-colors font-bold">
              <Store className="w-3.5 h-3.5" />
              Seller Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Location Pin */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sport-orange to-amber-500 flex items-center justify-center text-white shadow-glow-orange group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-white stroke-none" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white font-heading leading-none">
                  SPORT<span className="text-sport-orange">KART</span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-bold uppercase mt-0.5">
                  Hyperlocal Sports
                </span>
              </div>
            </Link>

            {/* Location Selector Button */}
            <button
              onClick={() => dispatch(setLocationModalOpen(true))}
              className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-600 text-left transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-sport-orange/20 text-sport-orange flex items-center justify-center group-hover:bg-sport-orange group-hover:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] leading-tight">Delivering to</span>
                <span className="font-bold text-white flex items-center gap-1">
                  {city} <span className="text-sport-orange text-[11px]">({radius}km)</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
            </button>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search English willow bat, Yonex racket, Nivia football, gym gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 bg-navy-800 border border-navy-600 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-sport-orange hover:bg-sport-orangeHover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Compare items badge */}
            <Link
              href="/compare"
              className="relative p-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-600 text-slate-300 hover:text-white transition-all hidden sm:flex items-center justify-center"
              title="Compare Sports Gear"
            >
              <Scale className="w-5 h-5" />
              {comparisonItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-sport-cyan text-navy-900 text-[11px] font-black flex items-center justify-center shadow-md">
                  {comparisonItems.length}
                </span>
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-600 text-slate-300 hover:text-white transition-all hidden sm:flex items-center justify-center"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shadow-md">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon with total preview */}
            <Link
              href="/cart"
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-md group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-white text-emerald-800 text-[11px] font-black flex items-center justify-center shadow-md">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-100 leading-tight">My Cart</span>
                <span className="text-xs font-black">₹{grandTotal}</span>
              </div>
            </Link>

            {/* User Profile / Auth Button */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 transition-all text-xs font-bold"
                >
                  <div className="w-7 h-7 rounded-lg bg-sport-orange/20 text-sport-orange flex items-center justify-center font-black">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-xs font-bold text-white transition-all"
                >
                  <User className="w-4 h-4 text-sport-orange" />
                  <span>Login</span>
                </Link>
              )}

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl p-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-navy-700/80 mb-1">
                    <p className="font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-sport-orange/20 text-sport-orange rounded text-[10px] font-extrabold uppercase">
                      {user?.role}
                    </span>
                  </div>

                  {user?.role === 'seller' && (
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-300 hover:bg-navy-800 font-bold"
                    >
                      <Store className="w-4 h-4 text-amber-400" />
                      Seller Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile & Addresses
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                  >
                    <PackageCheck className="w-4 h-4 text-slate-400" />
                    My Orders & Tracking
                  </Link>
                  <Link
                    href="/recommendations"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-sport-orange" />
                    AI Recommendations
                  </Link>

                  <div className="border-t border-navy-700/80 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 font-bold text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-navy-800 border border-navy-600 text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Sub-Navbar with Navigation Links */}
        <nav className="hidden md:flex items-center justify-between border-t border-navy-800/80 py-2.5 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-sport-orange transition-colors flex items-center gap-1.5">
              Home
            </Link>
            <Link href="/shop" className="hover:text-sport-orange transition-colors">
              All Products
            </Link>
            <Link href="/nearby" className="hover:text-sport-orange transition-colors flex items-center gap-1 text-emerald-400 font-bold">
              <MapPin className="w-3.5 h-3.5" />
              Nearby Shops Map
            </Link>
            <Link href="/recommendations" className="hover:text-sport-orange transition-colors flex items-center gap-1 text-sport-orange font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              AI Recommendations
            </Link>
            <Link href="/orders" className="hover:text-sport-orange transition-colors">
              My Orders
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-[11px]">Popular in Tiptur:</span>
            {['Cricket', 'Badminton', 'Football', 'Fitness'].map((cat) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-all text-[11px]"
              >
                {cat}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-t border-navy-800 p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search sports gear in Tiptur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-sm text-white focus:outline-none focus:border-sport-orange"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <button
            onClick={() => {
              dispatch(setLocationModalOpen(true));
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-navy-800 text-left text-xs"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sport-orange" />
              <span>Location: <strong>{city} ({radius} km)</strong></span>
            </div>
            <span className="text-sport-orange font-bold">Change</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-navy-800 rounded-xl hover:bg-navy-700 text-center"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-navy-800 rounded-xl hover:bg-navy-700 text-center"
            >
              Shop All
            </Link>
            <Link
              href="/nearby"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800/40 rounded-xl text-center"
            >
              📍 Nearby Shops Map
            </Link>
            <Link
              href="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-sport-orange/20 text-sport-orange border border-sport-orange/30 rounded-xl text-center"
            >
              ✨ AI Recommendations
            </Link>
          </div>

          <div className="border-t border-navy-800 pt-3">
            <p className="text-[11px] font-bold uppercase text-slate-500 mb-2">Sports Categories</p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {categories.map((c) => (
                <Link
                  key={c.name}
                  href={`/shop?category=${c.name}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-navy-800/60 rounded-lg text-slate-300 hover:text-white flex items-center gap-1 truncate text-[11px]"
                >
                  <span>{c.icon}</span>
                  <span className="truncate">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
