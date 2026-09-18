'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../../store/cartSlice';
import { addToast } from '../../store/toastSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Store,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalItems, subtotal, deliveryFee, discount, grandTotal } = useSelector((state) => state.cart);

  // Group items by shop
  const groupedByShop = items.reduce((acc, item) => {
    const sId = item.shopId || 'shop-1';
    if (!acc[sId]) {
      acc[sId] = {
        shopName: item.shopName || 'Local Sports Store',
        items: []
      };
    }
    acc[sId].items.push(item);
    return acc;
  }, {});

  const handleUpdateQuantity = (productId, newQty, name) => {
    dispatch(updateQuantity({ productId, quantity: newQty }));
    if (newQty <= 0) {
      dispatch(addToast({ type: 'info', message: `Removed ${name} from cart` }));
    }
  };

  const handleRemoveItem = (productId, name) => {
    dispatch(removeFromCart(productId));
    dispatch(addToast({ type: 'info', message: `Removed ${name} from cart` }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-black text-slate-900 font-heading mb-2">My Shopping Cart</h1>
        <p className="text-xs text-slate-500 mb-8">
          Items are packaged and fulfilled directly from verified Tiptur sports stores.
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
              🛒
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Your Cart is Empty</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore cricket bats, footballs, badminton racquets, and workout accessories from sports stores in Tiptur.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-gradient-to-r from-sport-orange to-amber-500 text-white font-bold text-xs rounded-2xl shadow-glow-orange hover:from-sport-orangeHover hover:to-amber-600 transition-all inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items Grouped by Shop */}
            <div className="lg:col-span-8 space-y-6">
              {Object.entries(groupedByShop).map(([sId, group]) => (
                <div key={sId} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                  {/* Shop Section Header */}
                  <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-sport-orange" />
                      <span className="text-xs font-bold text-slate-900">
                        Fulfilling Store: <strong className="text-slate-900">{group.shopName}</strong>
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      30-Min Local Dispatch
                    </span>
                  </div>

                  {/* Items in this shop */}
                  <div className="divide-y divide-slate-100 p-6 space-y-4">
                    {group.items.map((item) => (
                      <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 first:pt-0">
                        {/* Image & Title */}
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link href={`/product/${item.productId}`}>
                              <h4 className="font-bold text-sm text-slate-900 hover:text-sport-orange transition-colors truncate">
                                {item.name}
                              </h4>
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Price: <strong>₹{item.price?.toLocaleString('en-IN')}</strong> each
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.productId, item.name)}
                              className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 mt-2 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Quantity Controls & Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity pill */}
                          <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.name)}
                              className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.name)}
                              className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right min-w-[90px]">
                            <span className="text-base font-black text-slate-900 font-heading block">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => dispatch(clearCart())}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Entire Cart
              </button>
            </div>

            {/* Right: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary ({totalItems} items)
                </h3>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Cart Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Hyperlocal Delivery</span>
                    <span className="font-bold text-slate-900">
                      {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span>Tiptur Local Offer Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  {subtotal < 999 && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      💡 Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for <strong>FREE Local Delivery</strong>!
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                  <div>
                    <span className="font-black text-lg text-slate-900 block font-heading">Total Amount</span>
                    <span className="text-[10px] text-slate-400">All local taxes included</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900 font-heading">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 justify-center">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guaranteed delivery in 30-45 mins</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
