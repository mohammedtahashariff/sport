'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { setLocationModalOpen } from '../store/locationSlice';
import { api } from '../services/api';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MobileNav from '../components/common/MobileNav';
import ProductCard from '../components/customer/ProductCard';
import ShopCard from '../components/customer/ShopCard';
import {
  Zap,
  MapPin,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Scale,
  Compass,
  CheckCircle2,
  Navigation,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Cricket', icon: '🏏', bg: 'from-amber-500/20 to-orange-500/10', count: '14+ Products' },
  { name: 'Badminton', icon: '🏸', bg: 'from-emerald-500/20 to-teal-500/10', count: '12+ Products' },
  { name: 'Football', icon: '⚽', bg: 'from-blue-500/20 to-indigo-500/10', count: '10+ Products' },
  { name: 'Fitness', icon: '💪', bg: 'from-rose-500/20 to-pink-500/10', count: '8+ Products' },
  { name: 'Running', icon: '🏃', bg: 'from-purple-500/20 to-violet-500/10', count: '6+ Products' },
  { name: 'Basketball', icon: '🏀', bg: 'from-amber-600/20 to-amber-500/10', count: '4+ Products' },
  { name: 'Volleyball', icon: '🏐', bg: 'from-cyan-500/20 to-sky-500/10', count: '5+ Products' },
  { name: 'Tennis', icon: '🎾', bg: 'from-lime-500/20 to-green-500/10', count: '4+ Products' }
];

export default function HomePage() {
  const dispatch = useDispatch();
  const { city, lat, lng, radius } = useSelector((state) => state.location);

  const [nearbyShops, setNearbyShops] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [shopsRes, prodsRes, recRes] = await Promise.all([
          api.getNearbyShops({ lat, lng, radius }),
          api.getProducts({ lat, lng, sort: 'rating' }),
          api.getRecommendations({ limit: 4 })
        ]);

        if (shopsRes.success) setNearbyShops(shopsRes.shops || []);
        if (prodsRes.success) setPopularProducts(prodsRes.products || []);
        if (recRes.success) setAiRecommendations(recRes.personalized || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, [lat, lng, radius]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-900 text-white overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-navy-800">
          {/* Background sports graphics & glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-sport-orange/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-800/90 border border-navy-700 backdrop-blur-md shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <MapPin className="w-4 h-4 text-sport-orange" />
                <span className="text-xs text-slate-300">
                  Delivering to <strong className="text-white">{city}</strong> ({radius} km radius)
                </span>
                <button
                  onClick={() => dispatch(setLocationModalOpen(true))}
                  className="text-xs font-bold text-sport-orange hover:underline ml-1"
                >
                  Change Location
                </button>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.1] text-white">
                Find Sports Gear <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sport-orange via-amber-400 to-amber-300">
                  Near You.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover products from trusted sports stores around you in <strong>Tiptur</strong>. Check real-time availability, compare local prices, and receive fast 30-minute door delivery.
              </p>

              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-sm tracking-wide shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/nearby"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-navy-800 hover:bg-navy-700 border border-navy-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <span>Find Nearby Shops ({nearbyShops.length})</span>
                </Link>
              </div>

              {/* Live metrics pill */}
              <div className="grid grid-cols-3 gap-3 pt-6 max-w-lg mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <span className="text-xl font-black text-sport-orange font-heading block">10+</span>
                  <span className="text-[11px] text-slate-400">Tiptur Sports Shops</span>
                </div>
                <div className="p-3 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <span className="text-xl font-black text-emerald-400 font-heading block">60+</span>
                  <span className="text-[11px] text-slate-400">Verified Equipment</span>
                </div>
                <div className="p-3 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <span className="text-xl font-black text-sport-cyan font-heading block">30m</span>
                  <span className="text-[11px] text-slate-400">Avg. Delivery Time</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual Hero Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-navy-900 border border-navy-700 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-400 ml-2">Tiptur Local Proximity Radar</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/40">
                    Live Active
                  </span>
                </div>

                {/* Radar Mock Visual */}
                <div className="relative h-64 rounded-2xl bg-navy-950 overflow-hidden flex items-center justify-center border border-navy-800">
                  <div className="absolute inset-0 bg-[radial-gradient(#263456_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                  {/* Concentric radar rings */}
                  <div className="w-48 h-48 rounded-full border border-navy-700/80 absolute"></div>
                  <div className="w-32 h-32 rounded-full border border-sport-orange/30 absolute"></div>
                  <div className="w-16 h-16 rounded-full border border-emerald-500/40 absolute"></div>

                  {/* Center User Pin */}
                  <div className="z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-sport-orange text-white flex items-center justify-center font-bold text-xs shadow-glow-orange animate-bounce">
                      📍
                    </div>
                    <span className="text-[10px] font-bold text-white mt-1 bg-navy-900 px-2 py-0.5 rounded-full border border-navy-700">
                      You ({city})
                    </span>
                  </div>

                  {/* Surrounding Shop Markers */}
                  <div className="absolute top-8 left-10 p-2 rounded-xl bg-navy-900/90 border border-navy-700 text-[10px] text-white flex items-center gap-1.5 shadow-lg animate-pulse">
                    <span>🏬</span>
                    <div>
                      <strong className="block leading-none">Chamundeshwari</strong>
                      <span className="text-emerald-400 font-bold">0.8 km</span>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-8 p-2 rounded-xl bg-navy-900/90 border border-navy-700 text-[10px] text-white flex items-center gap-1.5 shadow-lg">
                    <span>🏬</span>
                    <div>
                      <strong className="block leading-none">Kalpataru Arena</strong>
                      <span className="text-emerald-400 font-bold">1.2 km</span>
                    </div>
                  </div>

                  <div className="absolute top-12 right-12 p-2 rounded-xl bg-navy-900/90 border border-navy-700 text-[10px] text-white flex items-center gap-1.5 shadow-lg">
                    <span>🏸</span>
                    <div>
                      <strong className="block leading-none">Golden Shuttle</strong>
                      <span className="text-emerald-400 font-bold">1.5 km</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-navy-800">
                  <span>GPS: 13.2575° N, 76.4782° E</span>
                  <Link href="/nearby" className="text-sport-orange font-bold hover:underline flex items-center gap-1">
                    Open Full Map <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPORTS CATEGORIES */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Explore Sports Categories</h2>
              <p className="text-xs text-slate-500">Pick your favorite sport and browse in-stock local gear</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-sport-orange hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/shop?category=${c.name}`}
                className="group p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-sport-orange hover:shadow-card-hover transition-all duration-300 text-center flex flex-col items-center justify-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${c.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform mb-2`}>
                  {c.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-xs group-hover:text-sport-orange transition-colors truncate w-full">
                  {c.name}
                </h3>
                <span className="text-[10px] text-slate-400 mt-0.5">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* NEARBY SPORTS SHOES & STORES (PROXIMITY) */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-100/60 rounded-3xl my-6 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Hyperlocal Proximity
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Sports Stores Near You in {city}</h2>
              <p className="text-xs text-slate-500">Shop directly from local merchants with walk-in warranties and instant delivery</p>
            </div>
            <Link
              href="/nearby"
              className="px-5 py-2.5 bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Interactive Map View</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyShops.slice(0, 3).map((shop) => (
              <ShopCard key={shop.id || shop._id} shop={shop} />
            ))}
          </div>
        </section>

        {/* AI RECOMMENDATIONS SECTION */}
        {aiRecommendations.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white relative overflow-hidden border border-navy-800 mb-8">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sport-orange/20 text-sport-orange text-xs font-bold mb-3 border border-sport-orange/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Personalized Recommendations
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight text-white mb-2">
                  Curated Sports Gear for Your Playing Style
                </h2>
                <p className="text-xs text-slate-300">
                  Based on popular tournament equipment, cricket matches, and athletic trends in Tiptur.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiRecommendations.map((prod) => (
                <ProductCard key={prod.id || prod._id} product={prod} />
              ))}
            </div>
          </section>
        )}

        {/* POPULAR SPORTS PRODUCTS */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-heading">Top Rated Sports Equipment</h2>
              <p className="text-xs text-slate-500">Highest rated cricket bats, rackets, footballs & fitness gear</p>
            </div>
            <Link href="/shop" className="text-xs font-bold text-sport-orange hover:underline flex items-center gap-1">
              Explore All Gear <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.slice(0, 8).map((prod) => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        </section>

        {/* HOW SPORTKART WORKS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-slate-900 font-heading">How SportKart Works</h2>
            <p className="text-xs text-slate-500 mt-1">
              Digitizing sports retail for small towns. Direct from local shop owners to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sport-orange/10 text-sport-orange flex items-center justify-center font-black text-lg mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Detect Location</h3>
              <p className="text-xs text-slate-500">Detect GPS or select Tiptur & surrounding radius</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Find Nearby Shops</h3>
              <p className="text-xs text-slate-500">Explore authentic local sports stores and live stock</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sport-cyan/10 text-sport-cyan flex items-center justify-center font-black text-lg mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Compare Products</h3>
              <p className="text-xs text-slate-500">Compare specs & prices across local shops</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Order Locally</h3>
              <p className="text-xs text-slate-500">Pay via UPI, Card or Cash on Delivery</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black text-lg mx-auto mb-4">
                5
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Track Live Order</h3>
              <p className="text-xs text-slate-500">Real-time status updates from prep to delivery</p>
            </div>
          </div>
        </section>

        {/* BECOME A SELLER CTA */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border border-navy-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider border border-amber-400/30">
                For Local Sports Shop Owners
              </span>
              <h2 className="text-3xl font-black font-heading text-white">
                Grow Your Sports Store in Tiptur with SportKart
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                List your products online, manage live inventory, accept digital orders, and reach thousands of local players without building your own app.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/seller/register"
                className="w-full sm:w-auto px-6 py-3.5 bg-sport-orange hover:bg-sport-orangeHover text-white font-bold text-xs rounded-2xl shadow-glow-orange transition-all text-center"
              >
                Register Your Sports Shop
              </Link>
              <Link
                href="/seller/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white font-bold text-xs rounded-2xl transition-all text-center"
              >
                Seller Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
