'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Star } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Cricket',
  'Football',
  'Badminton',
  'Basketball',
  'Volleyball',
  'Tennis',
  'Fitness',
  'Running',
  'Gym Accessories',
  'Sports Shoes',
  'Sports Clothing',
  'Accessories'
];

const BRANDS = [
  'All',
  'SS',
  'SG',
  'Yonex',
  'Nivia',
  'Cosco',
  'Nike',
  'Li-Ning',
  'Wilson',
  'Spalding',
  'Boldfit',
  'Sega',
  'Strauss'
];

const RADIUS_OPTIONS = [
  { label: 'All Tiptur Area', value: '' },
  { label: 'Within 2 km', value: '2' },
  { label: 'Within 5 km', value: '5' },
  { label: 'Within 10 km', value: '10' },
  { label: 'Within 25 km', value: '25' }
];

export default function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0
}) {
  return (
    <aside className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-navy-900 text-sport-orange flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
            <span className="text-[11px] text-slate-400">{totalResults} items found</span>
          </div>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-bold text-slate-500 hover:text-sport-orange flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Sports Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All') === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange('category', cat === 'All' ? '' : cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                  isSelected
                    ? 'bg-navy-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sport-orange" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Distance Radius */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Distance from You
        </h4>
        <div className="space-y-1.5">
          {RADIUS_OPTIONS.map((r) => {
            const isSelected = (filters.radius || '') === r.value;
            return (
              <label
                key={r.label}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sport-orange bg-orange-50/50 text-slate-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span>{r.label}</span>
                <input
                  type="radio"
                  name="radiusFilter"
                  checked={isSelected}
                  onChange={() => onFilterChange('radius', r.value)}
                  className="text-sport-orange focus:ring-sport-orange"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price
          </h4>
          <span className="text-xs font-black text-slate-900">
            ₹{filters.maxPrice ? parseInt(filters.maxPrice).toLocaleString('en-IN') : '7,000+'}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="8000"
          step="100"
          value={filters.maxPrice || 8000}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sport-orange"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹200</span>
          <span>₹4,000</span>
          <span>₹8,000</span>
        </div>
      </div>

      {/* Brand Selection */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Sports Brand
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {BRANDS.map((brand) => {
            const isSelected = (filters.brand || 'All') === brand;
            return (
              <button
                key={brand}
                onClick={() => onFilterChange('brand', brand === 'All' ? '' : brand)}
                className={`px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  isSelected
                    ? 'bg-sport-orange text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Customer Rating
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {[4, 4.5, 4.8].map((rating) => {
            const isSelected = parseFloat(filters.minRating) === rating;
            return (
              <button
                key={rating}
                onClick={() => onFilterChange('minRating', isSelected ? '' : rating)}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating}+</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* In-stock toggle */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === 'true' || filters.inStock === true}
            onChange={(e) => onFilterChange('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded text-sport-orange focus:ring-sport-orange border-slate-300"
          />
          <span className="text-xs font-bold text-slate-700">In Stock Nearby Only</span>
        </label>
      </div>
    </aside>
  );
}
