'use client';

import React from 'react';
import Link from 'next/link';
import RatingStars from '../common/RatingStars';
import { MapPin, Phone, ShieldCheck, Clock, ArrowRight, Package } from 'lucide-react';

export default function ShopCard({ shop, onSelectShop = null, isSelected = false }) {
  const shopId = shop.id || shop._id;

  return (
    <div
      onClick={() => onSelectShop && onSelectShop(shop)}
      className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-card-hover cursor-pointer ${
        isSelected
          ? 'border-sport-orange ring-2 ring-sport-orange/20 shadow-glow-orange'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Banner / Header visual */}
      <div className="relative h-28 w-full bg-navy-900 overflow-hidden">
        <img
          src={shop.banner || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"}
          alt={shop.name}
          className="w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

        {/* Distance Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-navy-900/90 backdrop-blur-md text-emerald-400 font-bold text-xs flex items-center gap-1 shadow-md border border-emerald-500/30">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          {shop.distanceText || `${shop.distanceKm || 1.2} km`}
        </div>

        {/* Status Tag */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
            shop.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}>
            {shop.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Shop Info details */}
      <div className="p-5 relative pt-0">
        {/* Overlapping Logo */}
        <div className="relative -mt-8 mb-3 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden shrink-0">
            <img
              src={shop.logo || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200"}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-right">
            <RatingStars rating={shop.rating || 4.8} count={shop.reviewCount || 45} />
          </div>
        </div>

        {/* Title & Verified */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-bold text-slate-900 text-base leading-snug truncate hover:text-sport-orange transition-colors">
            {shop.name}
          </h3>
          {shop.isVerified && (
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified Local Retailer" />
          )}
        </div>

        {/* Address */}
        <p className="text-xs text-slate-500 line-clamp-1 mb-3 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {shop.address}, {shop.city || 'Tiptur'}
        </p>

        {/* Operating Hours & Phone */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-sport-orange" />
            {shop.openingHours || '8:30 AM - 9:00 PM'}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Phone className="w-3 h-3 text-slate-400" />
            {shop.phone || '+91 98451 22345'}
          </span>
        </div>

        {/* Metrics & Action button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Package className="w-4 h-4 text-sport-orange" />
            <span><strong>{shop.productCount || '15+'}</strong> Sports Items</span>
          </div>

          <Link
            href={`/shop-details/${shopId}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm group-hover:shadow-glow-orange"
          >
            <span>View Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
