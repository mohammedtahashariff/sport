'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { removeFromWishlist } from '../../store/wishlistSlice';
import { addToast } from '../../store/toastSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ProductCard from '../../components/customer/ProductCard';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-heading">My Wishlist</h1>
            <p className="text-xs text-slate-500 mt-1">
              Saved sports gear available at local sports stores in Tiptur
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200">
            {wishlistItems.length} Items Saved
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mb-6">Explore authentic sports gear and click the heart icon to save items.</p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-navy-900 text-white font-bold text-xs rounded-xl hover:bg-sport-orange transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((prod) => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
