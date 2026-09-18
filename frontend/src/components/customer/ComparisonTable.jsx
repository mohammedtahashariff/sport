'use client';

import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../../store/comparisonSlice';
import { addToCart } from '../../store/cartSlice';
import { addToast } from '../../store/toastSlice';
import RatingStars from '../common/RatingStars';
import { X, ShoppingCart, Trash2, MapPin, Check, ExternalLink } from 'lucide-react';

export default function ComparisonTable({ products = [] }) {
  const dispatch = useDispatch();

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚖️
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Products in Comparison</h3>
        <p className="text-xs text-slate-500 mb-6">
          Compare specs, local shop distances, and pricing between up to 4 items simultaneously.
        </p>
        <Link
          href="/shop"
          className="px-6 py-2.5 bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          Browse Sports Gear
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(addToast({
      type: 'success',
      title: 'Added to Cart 🛒',
      message: `${product.name} from ${product.shopName || 'Local Shop'}`
    }));
  };

  const rows = [
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Price', render: (p) => <span className="font-black text-slate-900 font-heading text-base">₹{p.price?.toLocaleString('en-IN')}</span> },
    { label: 'Rating', render: (p) => <RatingStars rating={p.rating || 4.5} count={p.reviewCount} /> },
    { label: 'Shop Name', render: (p) => <span className="font-bold text-slate-800">{p.shopName || 'Local Store'}</span> },
    { label: 'Distance from You', render: (p) => <span className="text-emerald-700 font-bold flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {p.distanceText || '1.2 km away'}</span> },
    { label: 'Availability', render: (p) => p.stock > 0 ? <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> In Stock ({p.stock} units)</span> : <span className="text-rose-600 font-bold">Out of Stock</span> },
    { label: 'Material', render: (p) => p.specifications?.material || 'Standard Grade' },
    { label: 'Weight', render: (p) => p.specifications?.weight || 'Standard' },
    { label: 'Size', render: (p) => p.specifications?.size || 'Standard Size' },
    { label: 'Color', render: (p) => p.specifications?.color || 'Assorted' },
    { label: 'Ideal For', render: (p) => p.specifications?.idealFor || 'All Sports Enthusiasts' },
    { label: 'Warranty', render: (p) => p.specifications?.warranty || 'Standard Manufacturer Warranty' },
    { label: 'In The Box', render: (p) => p.specifications?.inTheBox || '1 Unit' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
          Comparing {products.length} Sports Gear Items
        </span>
        <button
          onClick={() => dispatch(clearCompare())}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Comparison
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="p-4 w-48 text-xs font-bold uppercase tracking-wider text-slate-500">
                Product Details
              </th>
              {products.map((p) => {
                const id = p.id || p._id;
                return (
                  <th key={id} className="p-4 text-center min-w-[200px] align-top relative">
                    <button
                      onClick={() => dispatch(removeFromCompare(id))}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-100 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-slate-100 overflow-hidden mb-3 border border-slate-200">
                      <img
                        src={(p.images && p.images[0]) || p.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300"}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Link
                      href={`/product/${id}`}
                      className="text-xs font-bold text-slate-900 hover:text-sport-orange line-clamp-2 leading-tight mb-2 block"
                    >
                      {p.name}
                    </Link>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="w-full py-2 bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-slate-900 bg-slate-50/30">
                  {row.label}
                </td>
                {products.map((p) => {
                  const id = p.id || p._id;
                  return (
                    <td key={id} className="p-4 text-center">
                      {row.render ? row.render(p) : p[row.key] || '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
