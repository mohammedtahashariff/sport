'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLocationModalOpen, setRadius } from '../../store/locationSlice';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ShopCard from '../../components/customer/ShopCard';
import InteractiveShopMap from '../../components/customer/InteractiveShopMap';
import { MapPin, Navigation, SlidersHorizontal, Store, Star, Compass } from 'lucide-react';

export default function NearbyShopsPage() {
  const dispatch = useDispatch();
  const { city, lat, lng, radius } = useSelector((state) => state.location);

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openOnly, setOpenOnly] = useState(false);
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    async function loadNearby() {
      try {
        setLoading(true);
        const res = await api.getNearbyShops({
          lat,
          lng,
          radius,
          openOnly: openOnly ? 'true' : '',
          minRating
        });
        if (res.success) {
          setShops(res.shops || []);
          if (res.shops && res.shops.length > 0 && !selectedShop) {
            setSelectedShop(res.shops[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load nearby shops:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNearby();
  }, [lat, lng, radius, openOnly, minRating]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              GPS-Based Store Discovery
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-heading">
              Sports Stores Near You in {city}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sport-orange" />
              Showing {shops.length} verified local sports shops within {radius} km
            </p>
          </div>

          {/* Quick Location & Radius Action */}
          <button
            onClick={() => dispatch(setLocationModalOpen(true))}
            className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm"
          >
            <Navigation className="w-4 h-4 text-sport-orange" />
            <span>Adjust GPS / Radius ({radius} km)</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-700">Radius Filter:</span>
            {[2, 5, 10, 15, 25].map((r) => (
              <button
                key={r}
                onClick={() => dispatch(setRadius(r))}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  radius === r
                    ? 'bg-sport-orange text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="w-4 h-4 rounded text-sport-orange focus:ring-sport-orange"
              />
              <span>Open Stores Only</span>
            </label>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="p-1.5 bg-slate-100 rounded-xl font-bold text-slate-700 focus:outline-none"
            >
              <option value="">All Ratings</option>
              <option value="4.5">⭐ 4.5+ Rated</option>
              <option value="4.8">⭐ 4.8+ Rated</option>
            </select>
          </div>
        </div>

        {/* Split View: Map (Left) & Shop Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Map */}
          <div className="lg:col-span-6 sticky top-28">
            <InteractiveShopMap
              shops={shops}
              userLocation={{ lat, lng }}
              radiusKm={radius}
              selectedShop={selectedShop}
              onSelectShop={(shop) => setSelectedShop(shop)}
              height="600px"
            />
          </div>

          {/* RIGHT: Shop Cards List */}
          <div className="lg:col-span-6 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse h-48"></div>
                ))}
              </div>
            ) : shops.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-900 mb-1">No Shops in this Radius</h3>
                <p className="text-xs text-slate-500 mb-4">Try increasing your search radius to 25 km or select Tiptur Center.</p>
                <button
                  onClick={() => dispatch(setRadius(25))}
                  className="px-5 py-2 bg-sport-orange text-white font-bold text-xs rounded-xl"
                >
                  Expand Radius to 25 km
                </button>
              </div>
            ) : (
              shops.map((shop) => (
                <ShopCard
                  key={shop.id || shop._id}
                  shop={shop}
                  isSelected={selectedShop && (selectedShop.id === shop.id || selectedShop._id === shop._id)}
                  onSelectShop={(s) => setSelectedShop(s)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
