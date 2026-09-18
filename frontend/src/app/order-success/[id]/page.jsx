'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import MobileNav from '../../../components/common/MobileNav';
import { CheckCircle2, Truck, Package, ArrowRight, Home, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 w-full text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
          {/* Animated Success Check */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-200">
              Order Confirmed & Transmitted
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-3">
              Thank You for Supporting Local Sports!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Your order <strong>#{orderId}</strong> has been routed to the local sports shop in Tiptur. The seller is preparing your gear for dispatch.
            </p>
          </div>

          {/* Key Info Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sport-orange/10 text-sport-orange flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Delivery</span>
                <span className="font-bold text-slate-900 text-sm">30 - 45 Minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Quality Guarantee</span>
                <span className="font-bold text-slate-900 text-sm">100% Verified Local Store</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/track-order/${orderId}`}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-glow-orange flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Order Progress</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/orders"
              className="w-full sm:w-auto px-6 py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-2xl transition-all"
            >
              View All My Orders
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-sport-orange transition-colors inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Return to SportKart Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
