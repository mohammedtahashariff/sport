'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { api } from '../../../services/api';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import MobileNav from '../../../components/common/MobileNav';
import ProductCard from '../../../components/customer/ProductCard';
import RatingStars from '../../../components/common/RatingStars';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Package,
  Search,
  Store,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

export default function ShopDetailsPage() {
  const params = useParams();
  const shopId = params.id;
  const { lat, lng } = useSelector((state) => state.location);

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadShop() {
      try {
        setLoading(true);
        const res = await api.getShopById(shopId, { lat, lng });
        if (res.success) {
          setShop(res.shop);
        }
      } catch (err) {
        console.error('Error fetching shop:', err);
      } finally {
        setLoading(false);
      }
    }

    if (shopId) {
      loadShop();
    }
  }, [shopId, lat, lng]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center flex items-center justify-center">
          <p className="text-sm font-bold text-slate-600">Loading Sports Store Profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Store Not Found</h2>
          <Link href="/nearby" className="px-6 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold">
            Back to Nearby Stores
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const products = shop.products || [];
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/nearby" className="hover:text-slate-700">Nearby Shops</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">{shop.name}</span>
        </div>

        {/* Shop Header Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mb-8">
          {/* Banner Image */}
          <div className="relative h-48 sm:h-64 w-full bg-navy-900 overflow-hidden">
            <img
              src={shop.banner || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200"}
              alt={shop.name}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-navy-900/90 backdrop-blur-md rounded-xl text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1 shadow-md">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {shop.distanceText || '1.2 km away'}
              </span>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold text-white shadow-md ${shop.isOpen ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                {shop.isOpen ? 'Open Now' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Shop details bar */}
          <div className="p-6 sm:p-8 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-6">
              {/* Logo */}
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white bg-white shadow-xl overflow-hidden shrink-0">
                  <img
                    src={shop.logo || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=300"}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading leading-tight">
                      {shop.name}
                    </h1>
                    {shop.isVerified && (
                      <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" title="Verified Local Retailer" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {shop.address}, {shop.city || 'Tiptur'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <RatingStars rating={shop.rating || 4.8} count={shop.reviewCount || 120} size="w-5 h-5" />
              </div>
            </div>

            {/* Quick Contacts & Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-sport-orange" />
                <span>Hours: <strong>{shop.openingHours || '9:00 AM - 9:00 PM'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Phone: <strong>{shop.phone || '+91 98451 22345'}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Award className="w-4 h-4 text-sport-cyan" />
                <span>Delivery: <strong>Within {shop.deliveryRadiusKm || 15} km (Tiptur)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Store Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'about'
                ? 'bg-navy-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            About Store
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === c
                        ? 'bg-sport-orange text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Shop Search Input */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search in this shop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:border-sport-orange focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800">No matching products found in this shop</p>
                <p className="text-xs text-slate-400">Try changing your search term or category selection</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id || p._id} product={{ ...p, shopName: shop.name }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">About {shop.name}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {shop.description || 'Authorized sports retail store serving Tiptur with genuine athletic equipment, kit bags, tournament balls, and custom team jersey printing.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Store Services & Guarantees:</h4>
              <ul className="space-y-2 text-slate-600 list-disc list-inside">
                <li>Walk-in inspection & bat knocking/oiling services available</li>
                <li>Express 30-45 minute hyperlocal delivery across Tiptur taluk</li>
                <li>Authorized manufacturer warranty on all racquets and gear</li>
                <li>Instant UPI, Debit/Credit Card, and Cash on Delivery accepted</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
