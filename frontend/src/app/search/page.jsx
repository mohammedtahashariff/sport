'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ProductCard from '../../components/customer/ProductCard';
import { Search, MapPin, Sparkles, Filter } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { lat, lng } = useSelector((state) => state.location);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function executeSearch() {
      try {
        setLoading(true);
        const res = await api.getProducts({
          search: query,
          lat,
          lng
        });
        if (res.success) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [query, lat, lng]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search header banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sport-orange/10 text-sport-orange flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Search Results</span>
              <h1 className="text-2xl font-black text-slate-900 font-heading">
                {query ? `"${query}"` : 'All Products'}
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sport-orange" />
            <span><strong>{products.length}</strong> sports equipment items found near your location in Tiptur</span>
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div className="aspect-square bg-slate-200 rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900 mb-1">No Matching Gear Found</h3>
            <p className="text-xs text-slate-500 mb-6">
              Try searching for &quot;cricket bat&quot;, &quot;yonex racket&quot;, &quot;nivia football&quot;, or &quot;dumbbells&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((prod) => (
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">Searching sports catalog...</div>}>
      <SearchContent />
    </Suspense>
  );
}
