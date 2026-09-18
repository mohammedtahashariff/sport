'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../../../services/api';
import SellerHeader from '../../../components/seller/SellerHeader';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Award,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';

const DATE_FILTERS = ['Today', '7 Days', '30 Days', '3 Months', '1 Year'];

export default function SellerAnalyticsPage() {
  const { shop } = useSelector((state) => state.auth);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDateFilter, setActiveDateFilter] = useState('7 Days');

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await api.getSellerDashboard();
        if (res.success) {
          setAnalytics(res);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [activeDateFilter]);

  const categoryDistribution = analytics?.categoryDistribution || [
    { category: 'Cricket', count: 6, percentage: 38 },
    { category: 'Badminton', count: 4, percentage: 25 },
    { category: 'Football', count: 3, percentage: 19 },
    { category: 'Fitness', count: 3, percentage: 18 }
  ];

  return (
    <div>
      <SellerHeader
        title="Business Intelligence & Analytics"
        subtitle="Track revenue growth, category performance, and customer retention in Tiptur"
      />

      <main className="p-8 max-w-7xl space-y-8">
        {/* Date Filter Strip */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sport-orange" />
            <span className="font-bold text-slate-700">Time Range:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {DATE_FILTERS.map((df) => (
              <button
                key={df}
                onClick={() => setActiveDateFilter(df)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeDateFilter === df
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>

        {/* Top Financial KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales</span>
            <span className="text-3xl font-black text-slate-900 font-heading block">
              ₹84,950
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +24% growth
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</span>
            <span className="text-3xl font-black text-slate-900 font-heading block">
              ₹1,640
            </span>
            <span className="text-[11px] text-slate-400">Club bats & racket bundles</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Repeat Customer Rate</span>
            <span className="text-3xl font-black text-slate-900 font-heading block">
              64.2%
            </span>
            <span className="text-[11px] font-bold text-emerald-600">Local Tiptur athletes</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Store Rating Score</span>
            <span className="text-3xl font-black text-amber-500 font-heading block">
              4.8 / 5.0
            </span>
            <span className="text-[11px] text-slate-400">Based on 142 reviews</span>
          </div>
        </div>

        {/* Category Revenue Share and Sales Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Share Distribution */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sport-orange" />
                <h3 className="font-bold text-base text-slate-900">Category Revenue Share</h3>
              </div>
            </div>

            <div className="space-y-4">
              {categoryDistribution.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{cat.category}</span>
                    <span className="text-slate-900">{cat.percentage}% ({cat.count} products)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className="bg-gradient-to-r from-navy-900 to-sport-orange h-full rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Market Trends */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">Key Hyperlocal Insights</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-0.5">🏏 Cricket Gear Peak: Weekends</h4>
                <p className="text-[11px] text-slate-500">
                  Leather match balls and bat grips see 3x higher demand on Friday evenings ahead of local tournament matches in Tiptur stadium.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-0.5">🏸 Badminton Stringing & Racquets: College Students</h4>
                <p className="text-[11px] text-slate-500">
                  High demand from Kalpataru College students for Yonex Astrox & Li-Ning racquets within a 2 km radius.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-0.5">⚡ 30-Min Dispatch Advantage</h4>
                <p className="text-[11px] text-slate-500">
                  92% of customers chose your store over distant e-commerce sites due to immediate same-day match readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
