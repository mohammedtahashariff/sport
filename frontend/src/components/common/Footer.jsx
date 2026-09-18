'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, MapPin, Phone, Mail, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 pt-16 pb-24 md:pb-12 border-t border-navy-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-navy-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sport-orange/10 border border-sport-orange/30 text-sport-orange flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">30-Min Local Delivery</h4>
              <p className="text-xs text-slate-400">Direct from local Tiptur sports stores</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">100% Genuine Gear</h4>
              <p className="text-xs text-slate-400">Authorized local brand retailers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sport-cyan/10 border border-sport-cyan/30 text-sport-cyan flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Easy Local Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free shop walk-in exchange</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Empowering Retailers</h4>
              <p className="text-xs text-slate-400">Digitizing sports shops in small towns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sport-orange to-amber-500 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-white stroke-none" />
            </div>
            <span className="text-2xl font-black text-white font-heading">
              SPORT<span className="text-sport-orange">KART</span>
            </span>
          </Link>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            &ldquo;Your Local Sports Store, Just a Click Away.&rdquo;
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            SportKart transforms the way sports enthusiasts and school/college athletes in small towns like Tiptur, Karnataka discover, compare, and order sports equipment in real-time.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-300 pt-2">
            <MapPin className="w-4 h-4 text-sport-orange" />
            <span>Serving Tiptur, Tumakuru, Arsikere & surrounding regions</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/" className="hover:text-white transition-colors">Home Hub</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/nearby" className="hover:text-white transition-colors">Nearby Sports Shops</Link></li>
            <li><Link href="/recommendations" className="hover:text-white transition-colors">AI Gear Recommender</Link></li>
            <li><Link href="/compare" className="hover:text-white transition-colors">Product Comparison</Link></li>
            <li><Link href="/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Popular Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/shop?category=Cricket" className="hover:text-white transition-colors">Cricket Bats & Gear</Link></li>
            <li><Link href="/shop?category=Badminton" className="hover:text-white transition-colors">Badminton Rackets & Shuttles</Link></li>
            <li><Link href="/shop?category=Football" className="hover:text-white transition-colors">Footballs & Studs</Link></li>
            <li><Link href="/shop?category=Fitness" className="hover:text-white transition-colors">Gym Weights & Dumbbells</Link></li>
            <li><Link href="/shop?category=Sports%20Shoes" className="hover:text-white transition-colors">Running & Court Shoes</Link></li>
            <li><Link href="/shop?category=Sports%20Clothing" className="hover:text-white transition-colors">Team Jerseys & Shorts</Link></li>
          </ul>
        </div>

        {/* Seller & Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Local Retailers</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/seller/login" className="text-sport-orange font-bold hover:underline">Seller Login</Link></li>
            <li><Link href="/seller/register" className="text-amber-400 hover:underline">Register Your Sports Shop</Link></li>
            <li><Link href="/seller/dashboard" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About SportKart</Link></li>
          </ul>
          <div className="mt-6 pt-4 border-t border-navy-800 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-sport-orange" />
              <span>+91 98451 22345</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-sport-orange" />
              <span>support@sportkart.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-navy-800 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} SportKart Hyperlocal Sports Commerce. Built with precision for local athletes & retailers.</p>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/about" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/about" className="hover:text-slate-300">Karnataka Retail Network</Link>
        </div>
      </div>
    </footer>
  );
}
