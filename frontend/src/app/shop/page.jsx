'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ProductCard from '../../components/customer/ProductCard';
import FilterSidebar from '../../components/customer/FilterSidebar';
import { SlidersHorizontal, ArrowUpDown, MapPin, Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialBrand = searchParams.get('brand') || '';

  const { lat, lng, radius } = useSelector((state) => state.location);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: initialCategory,
    brand: initialBrand,
    search: initialSearch,
    minPrice: '',
    maxPrice: '8000',
    inStock: '',
    minRating: '',
    radius: '',
    sort: 'relevance'
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await api.getProducts({
          ...filters,
          lat,
          lng
        });
        if (res.success) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters, lat, lng]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      search: '',
      minPrice: '',
      maxPrice: '8000',
      inStock: '',
      minRating: '',
      radius: '',
      sort: 'relevance'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-heading">
              {filters.category ? `${filters.category} Gear` : 'All Sports Equipment'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sport-orange" />
              Showing gear in-stock at verified local shops in Tiptur
            </p>
          </div>

          {/* Sorting & Filter controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-sport-orange" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-sm text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="nearest">Nearest Local Shop</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={products.length}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden col-span-1 mb-6 animate-in slide-in-from-top-4 duration-200">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalResults={products.length}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm animate-pulse space-y-4">
                    <div className="aspect-square bg-slate-200 rounded-2xl"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No Sports Gear Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any products matching your current filters or distance radius.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-sport-orange text-white text-xs font-bold rounded-xl shadow-glow-orange hover:bg-sport-orangeHover transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
