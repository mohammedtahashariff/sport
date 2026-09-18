'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserCoordinates, setRadius, setCity, setLocationModalOpen } from '../../store/locationSlice';
import { addToast } from '../../store/toastSlice';
import { MapPin, Navigation, Compass, Check, X, ShieldCheck } from 'lucide-react';

const QUICK_CITIES = [
  { city: 'Tiptur', state: 'Karnataka', lat: 13.2575, lng: 76.4782, label: 'Tiptur (Home Hub)' },
  { city: 'Arsikere', state: 'Karnataka', lat: 13.3134, lng: 76.2573, label: 'Arsikere (24 km)' },
  { city: 'Tumakuru', state: 'Karnataka', lat: 13.3392, lng: 77.1015, label: 'Tumakuru (72 km)' },
  { city: 'Hassan', state: 'Karnataka', lat: 13.0072, lng: 76.0962, label: 'Hassan (65 km)' },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, label: 'Bengaluru' }
];

const RADIUS_OPTIONS = [2, 5, 10, 15, 25, 50];

export default function LocationModal() {
  const dispatch = useDispatch();
  const { isModalOpen, city, lat, lng, radius, isDetected } = useSelector((state) => state.location);
  const [detecting, setDetecting] = useState(false);

  if (!isModalOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      dispatch(addToast({ type: 'error', message: 'Geolocation is not supported by your browser.' }));
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        dispatch(setUserCoordinates({
          lat: userLat,
          lng: userLng,
          city: 'My Current GPS Location',
          isDetected: true
        }));
        setDetecting(false);
        dispatch(addToast({
          type: 'success',
          title: 'Location Detected 📍',
          message: `GPS Lat: ${userLat.toFixed(4)}, Lng: ${userLng.toFixed(4)}`
        }));
        dispatch(setLocationModalOpen(false));
      },
      (error) => {
        setDetecting(false);
        console.warn('Geolocation error:', error.message);
        dispatch(addToast({
          type: 'warning',
          title: 'Using Tiptur Default',
          message: 'GPS access denied or unavailable. Defaulted to Tiptur, Karnataka.'
        }));
        dispatch(setUserCoordinates({
          lat: 13.2575,
          lng: 76.4782,
          city: 'Tiptur',
          isDetected: false
        }));
      },
      { timeout: 8000 }
    );
  };

  const handleSelectCity = (c) => {
    dispatch(setCity(c));
    dispatch(addToast({
      type: 'success',
      message: `Location changed to ${c.city}, ${c.state}`
    }));
    dispatch(setLocationModalOpen(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white relative">
          <button
            onClick={() => dispatch(setLocationModalOpen(false))}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sport-orange/20 border border-sport-orange/40 flex items-center justify-center text-sport-orange">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Select Your Sports Hub</h3>
              <p className="text-xs text-slate-300">Discover inventory in your immediate local radius</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* GPS Auto Detect CTA */}
          <button
            onClick={handleDetectGPS}
            disabled={detecting}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-sport-orange/10 to-amber-500/10 border-2 border-sport-orange/30 hover:border-sport-orange hover:bg-sport-orange/20 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sport-orange text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Navigation className={`w-5 h-5 ${detecting ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">Use Current GPS Location</span>
                <span className="text-xs text-slate-500">
                  {detecting ? 'Detecting satellite coordinates...' : 'Find nearest shops around your exact coordinates'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-sport-orange px-2.5 py-1 bg-white rounded-lg border border-sport-orange/30">
              {detecting ? 'Detecting' : 'Auto Detect'}
            </span>
          </button>

          {/* Radius Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Discovery Radius ({radius} km)
            </label>
            <div className="grid grid-cols-6 gap-2">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => dispatch(setRadius(r))}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    radius === r
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Quick Town Selectors */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Popular Local Towns & Districts
            </label>
            <div className="space-y-2">
              {QUICK_CITIES.map((c) => {
                const isSelected = city === c.city;
                return (
                  <button
                    key={c.city}
                    onClick={() => handleSelectCity(c)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'border-sport-green bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-sport-green' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium">{c.label}</span>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-sport-green text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hyperlocal distances are calculated in real-time with zero location data stored externally.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
