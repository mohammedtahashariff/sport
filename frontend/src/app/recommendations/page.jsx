'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ProductCard from '../../components/customer/ProductCard';
import { Sparkles, Zap, Brain, Trophy, ShieldCheck } from 'lucide-react';

export default function RecommendationsPage() {
  const { user } = useSelector((state) => state.auth);
  const { lat, lng } = useSelector((state) => state.location);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAIHub() {
      try {
        setLoading(true);
        const res = await api.getRecommendations();
        if (res.success) {
          setSections(res.sections || []);
        }
      } catch (err) {
        console.error('Failed to load AI recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAIHub();
  }, [lat, lng]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-navy-800 shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sport-orange/20 text-sport-orange text-xs font-black uppercase tracking-wider border border-sport-orange/30">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Hyperlocal Recommendation Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-white">
              AI Sports Gear Matcher
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SportKart analyzes your favorite sports, previous purchases, and local tournament gear preferences in Tiptur to recommend perfectly matched accessories.
            </p>
          </div>

          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 text-slate-400">
            <div className="p-4 rounded-2xl bg-navy-800/80 border border-navy-700 text-center">
              <Brain className="w-6 h-6 text-sport-orange mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white">Content Affinity</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-800/80 border border-navy-700 text-center">
              <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white">Tournament Grade</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-800/80 border border-navy-700 text-center">
              <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <span className="text-[10px] font-bold block text-white">30m Local Stock</span>
            </div>
          </div>
        </div>

        {/* Dynamic AI Sections */}
        {loading ? (
          <div className="space-y-12">
            {[1, 2].map((n) => (
              <div key={n} className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-48 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((m) => (
                    <div key={m} className="bg-white rounded-3xl p-4 border border-slate-200 h-64 animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading flex items-center gap-2">
                    <span>{section.title}</span>
                    <Sparkles className="w-4 h-4 text-sport-orange" />
                  </h2>
                  <p className="text-xs text-slate-500">{section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {section.products?.map((prod) => (
                    <ProductCard key={prod.id || prod._id} product={prod} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
