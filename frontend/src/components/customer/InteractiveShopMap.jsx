'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Compass, Store, Star } from 'lucide-react';

// Dynamically import Leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });

export default function InteractiveShopMap({
  shops = [],
  userLocation = { lat: 13.2575, lng: 76.4782 },
  radiusKm = 15,
  selectedShop = null,
  onSelectShop = null,
  height = '500px'
}) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  if (!isClient || !L) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-3xl bg-navy-950 flex flex-col items-center justify-center text-slate-400 p-6 border border-navy-800"
      >
        <div className="w-12 h-12 rounded-2xl bg-sport-orange/20 text-sport-orange flex items-center justify-center animate-pulse mb-3">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <p className="font-bold text-white text-sm">Loading Hyperlocal Sports Map...</p>
        <p className="text-xs text-slate-500">Mapping sports shops in Tiptur vicinity</p>
      </div>
    );
  }

  // Create custom Leaflet HTML icons
  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-sport-orange/30 animate-ping absolute"></div>
        <div class="w-6 h-6 rounded-full bg-sport-orange border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">
          📍
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const shopIcon = (isSelected) => L.divIcon({
    className: 'custom-shop-marker',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-125">
        <div class="w-8 h-8 rounded-2xl ${isSelected ? 'bg-sport-orange shadow-glow-orange scale-110' : 'bg-navy-900'} border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
          🏬
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const centerPos = [userLocation.lat || 13.2575, userLocation.lng || 76.4782];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80" style={{ height }}>
      {/* Map Overlay HUD */}
      <div className="absolute top-4 left-4 z-[500] bg-navy-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-navy-700 shadow-xl text-white text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold">
          <Navigation className="w-3.5 h-3.5 text-sport-orange" />
          <span>Local Radius: <strong>{radiusKm} km</strong></span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-emerald-400 font-bold">{shops.length} Sports Stores</span>
      </div>

      <MapContainer
        center={centerPos}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Proximity Circle */}
        <Circle
          center={centerPos}
          radius={radiusKm * 1000}
          pathOptions={{
            color: '#FF6B00',
            fillColor: '#FF6B00',
            fillOpacity: 0.06,
            weight: 1.5,
            dashArray: '4, 8'
          }}
        />

        {/* User GPS Pin */}
        <Marker position={centerPos} icon={userIcon}>
          <Popup className="custom-popup">
            <div className="p-1 text-center">
              <span className="font-bold text-xs text-navy-900 block">Your Current Location</span>
              <span className="text-[10px] text-slate-500">Tiptur Sports Hub</span>
            </div>
          </Popup>
        </Marker>

        {/* Shop Pins */}
        {shops.map((shop) => {
          const coords = shop.location?.coordinates || [76.4782, 13.2575];
          const pos = [coords[1], coords[0]];
          const isSelected = selectedShop && (selectedShop.id === shop.id || selectedShop._id === shop._id);

          return (
            <Marker
              key={shop.id || shop._id}
              position={pos}
              icon={shopIcon(isSelected)}
              eventHandlers={{
                click: () => {
                  if (onSelectShop) onSelectShop(shop);
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px] text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Store className="w-3.5 h-3.5 text-sport-orange" />
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">{shop.name}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-1.5">{shop.address}</p>
                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-100">
                    <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                      📍 {shop.distanceText || `${shop.distanceKm || 1.2} km away`}
                    </span>
                    <span className="font-bold text-amber-500 flex items-center gap-0.5">
                      ⭐ {shop.rating || 4.5}
                    </span>
                  </div>
                  <a
                    href={`/shop-details/${shop.id || shop._id}`}
                    className="mt-2 block w-full text-center py-1.5 bg-navy-900 hover:bg-sport-orange text-white rounded-lg text-[10px] font-bold transition-colors"
                  >
                    View Store Products
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
