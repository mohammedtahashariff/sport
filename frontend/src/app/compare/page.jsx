'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import ComparisonTable from '../../components/customer/ComparisonTable';
import { Scale } from 'lucide-react';

export default function ComparePage() {
  const comparisonItems = useSelector((state) => state.comparison.items);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-sport-cyan/20 text-sport-cyan flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-heading">Product Comparison</h1>
            <p className="text-xs text-slate-500">
              Analyze specs, local price differences, and proximity across Tiptur sports stores
            </p>
          </div>
        </div>

        <ComparisonTable products={comparisonItems} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
