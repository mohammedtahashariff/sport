'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import {
  Zap,
  Target,
  Eye,
  MapPin,
  ShieldCheck,
  Truck,
  Store,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        {/* Hero Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sport-orange/10 text-sport-orange text-xs font-bold border border-sport-orange/20">
            <Zap className="w-4 h-4 fill-sport-orange stroke-none" />
            <span>Hyperlocal Sports Commerce</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 font-heading leading-tight">
            Digitizing Local Sports Retail in Karnataka
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            &ldquo;Your Local Sports Store, Just a Click Away.&rdquo; Built to eliminate the friction of physical shop hopping and empower local sports retail merchants.
          </p>
        </section>

        {/* The Problem & Solution */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">The Local Retail Challenge</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In small towns like Tiptur, Karnataka, customers and school/college athletes need to physically visit multiple sports shops across town to check equipment availability, inspect bat willow grades, and compare prices. Meanwhile, local sports retailers lack digital platforms to showcase inventory and view sales analytics.
            </p>
          </div>

          <div className="bg-gradient-to-tr from-navy-950 to-navy-900 text-white rounded-3xl p-8 border border-navy-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sport-orange/20 text-sport-orange flex items-center justify-center font-bold text-xl">
              ⚡
            </div>
            <h2 className="text-xl font-bold text-white font-heading">The SportKart Solution</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              SportKart connects customers with nearby sports shops within a 15 km radius through GPS-based discovery, real-time inventory checks, AI-powered product recommendations, price comparisons across local stores, and a dedicated seller dashboard for shop owners.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sport-orange/10 text-sport-orange flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Make authentic sports equipment, cricket bats, racquets, tournament footballs, and fitness accessories instantly discoverable, comparable, and deliverable in 30-45 minutes across every taluk in India.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Create a scalable, decentralized hyperlocal sports marketplace starting from Tiptur, Karnataka, expanding to Tumakuru, Hassan, Arsikere, and tier-2/3 sports ecosystems across India.
            </p>
          </div>
        </section>

        {/* Local Merchant CTA */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 font-heading">Are You a Sports Retailer in Karnataka?</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
              Join SportKart today. Set up your shop profile, upload your catalog, and receive instant digital orders from local athletes in your town.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/seller/register"
              className="px-8 py-3.5 bg-sport-orange hover:bg-sport-orangeHover text-white font-bold text-xs rounded-2xl shadow-glow-orange transition-all flex items-center gap-2"
            >
              <span>Register Your Sports Shop</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/seller/login"
              className="px-6 py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-2xl transition-all"
            >
              Seller Login Portal
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
