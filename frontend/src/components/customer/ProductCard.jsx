'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { toggleCompare } from '../../store/comparisonSlice';
import { addToast } from '../../store/toastSlice';
import RatingStars from '../common/RatingStars';
import { ShoppingCart, Heart, Scale, MapPin, Check, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const comparisonItems = useSelector((state) => state.comparison.items);

  const prodId = product.id || product._id;
  const isWishlisted = wishlistItems.some(i => (i.id || i._id) === prodId);
  const isCompared = comparisonItems.some(i => (i.id || i._id) === prodId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(addToast({
      type: 'success',
      title: 'Added to Cart 🛒',
      message: `${product.name} from ${product.shopName || 'Local Shop'}`
    }));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    dispatch(addToast({
      type: 'info',
      title: isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️',
      message: product.name
    }));
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleCompare(product));
    dispatch(addToast({
      type: 'info',
      title: isCompared ? 'Removed from Comparison' : 'Added to Comparison ⚖️',
      message: isCompared ? product.name : `Added ${product.name} (Max 4 items)`
    }));
  };

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 3);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-sport-orange/40 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges & Actions Overlay */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <Link href={`/product/${prodId}`} className="block w-full h-full">
          <img
            src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Discount tag */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sport-orange to-amber-500 text-white font-extrabold text-[11px] shadow-md flex items-center gap-1">
            <Zap className="w-3 h-3 fill-white stroke-none" />
            {product.discount}% OFF
          </div>
        )}

        {/* AI Reason Badge if available */}
        {product.aiReason && (
          <div className="absolute bottom-3 left-3 right-3 px-2.5 py-1 rounded-xl bg-navy-950/85 backdrop-blur-md text-amber-300 font-bold text-[10px] truncate shadow-md border border-amber-400/20">
            ✨ {product.aiReason}
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isWishlisted
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-rose-50 hover:text-rose-500'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-none' : ''}`} />
          </button>
          <button
            onClick={handleToggleCompare}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isCompared
                ? 'bg-sport-cyan text-navy-900'
                : 'bg-white/90 text-slate-700 hover:bg-cyan-50 hover:text-cyan-700'
            }`}
            title="Compare with other products"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Proximity Tag */}
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1.5">
            <span className="font-semibold text-sport-orange uppercase tracking-wider text-[10px]">
              {product.brand} • {product.category}
            </span>
            {product.distanceText && (
              <span className="flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md text-[10px]">
                <MapPin className="w-3 h-3 text-emerald-600" />
                {product.distanceText}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/product/${prodId}`}>
            <h3 className="font-bold text-slate-900 text-sm hover:text-sport-orange transition-colors line-clamp-2 leading-snug mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Shop Name */}
          <p className="text-xs text-slate-500 truncate mb-2">
            Available at: <span className="font-medium text-slate-700">{product.shopName || 'Local Sports Hub'}</span>
          </p>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating || 4.5} count={product.reviewCount || 12} />
          </div>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 font-heading">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {isOutOfStock ? (
              <span className="text-[10px] font-bold text-rose-600 block">Out of stock</span>
            ) : isLowStock ? (
              <span className="text-[10px] font-bold text-amber-600 block">Only {product.stock} left!</span>
            ) : (
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> In Stock Locally
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-navy-900 hover:bg-sport-orange text-white hover:shadow-glow-orange active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
