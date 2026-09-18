'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { addToast } from '../../../store/toastSlice';
import SellerHeader from '../../../components/seller/SellerHeader';
import ProductModal from '../../../components/seller/ProductModal';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  Clock,
  CheckCircle2,
  Store
} from 'lucide-react';

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const { user, shop } = useSelector((state) => state.auth);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerDashboard();
      if (res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error('Failed to load seller dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (productData) => {
    try {
      const res = await api.createProduct(productData);
      if (res.success) {
        dispatch(addToast({ type: 'success', title: 'Product Added 🏆', message: productData.name }));
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to add product' }));
    }
  };

  const metrics = dashboardData?.metrics || {
    todaySales: 24580,
    totalSales: 84950,
    totalOrders: 128,
    activeOrders: 4,
    totalProducts: 15,
    lowStockCount: 3,
    totalCustomers: 48,
    shopRating: 4.8
  };

  const recentOrders = dashboardData?.recentOrders || [];
  const lowStockAlerts = dashboardData?.lowStockAlerts || [];
  const topProducts = dashboardData?.topProducts || [];

  return (
    <div>
      <SellerHeader
        title="Store Analytics & Overview"
        subtitle={`Managing ${shop?.name || "Chamundeshwari Sports Center"} • Tiptur Hub`}
        onAddProduct={() => setIsModalOpen(true)}
      />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sales */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today&apos;s Sales</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ₹
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900 font-heading">
                ₹{metrics.todaySales?.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs yesterday
              </span>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
              <div className="w-10 h-10 rounded-2xl bg-sport-orange/10 text-sport-orange flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {metrics.totalOrders}
              </span>
              <span className="text-[11px] font-bold text-amber-600 block">
                {metrics.activeOrders} pending local dispatch
              </span>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Products</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {metrics.totalProducts}
              </span>
              <span className="text-[11px] text-slate-400">Across 8 sports categories</span>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Items</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-rose-600 font-heading">
                {metrics.lowStockCount}
              </span>
              <Link href="/seller/inventory" className="text-[11px] font-bold text-rose-600 hover:underline block">
                Restock warnings &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Low Stock Warning Banner if any */}
        {lowStockAlerts.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Inventory Alert: {lowStockAlerts.length} Products Running Low</h4>
                <p className="text-[11px] text-amber-700">
                  {lowStockAlerts.map(p => `${p.name} (${p.stock} left)`).join(', ')}
                </p>
              </div>
            </div>
            <Link
              href="/seller/inventory"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
            >
              Update Stock
            </Link>
          </div>
        )}

        {/* Charts and Revenue Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sales Revenue Trend Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Weekly Revenue & Order Volume</h3>
                <p className="text-xs text-slate-400">Local Tiptur sales performance across the last 7 days</p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">Last 7 Days</span>
            </div>

            {/* SVG Visual Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2">
              {(dashboardData?.salesChart || [
                { date: 'Mon', sales: 14200, orders: 8 },
                { date: 'Tue', sales: 19800, orders: 12 },
                { date: 'Wed', sales: 16400, orders: 9 },
                { date: 'Thu', sales: 22100, orders: 15 },
                { date: 'Fri', sales: 28500, orders: 18 },
                { date: 'Sat', sales: 34900, orders: 24 },
                { date: 'Sun', sales: 31200, orders: 20 }
              ]).map((bar) => {
                const heightPercent = Math.min(100, Math.round((bar.sales / 35000) * 100));
                return (
                  <div key={bar.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(bar.sales / 1000).toFixed(1)}k
                    </span>
                    <div className="w-full bg-slate-100 rounded-2xl overflow-hidden h-44 flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-navy-900 to-sport-orange group-hover:to-amber-400 rounded-t-xl transition-all duration-500"
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{bar.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Selling Products in Store */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Bestselling Gear</h3>
              <Link href="/seller/products" className="text-xs font-bold text-sport-orange hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{p.name}</h4>
                      <span className="text-[11px] text-slate-400">{p.salesCount} sold locally</span>
                    </div>
                  </div>
                  <span className="font-black text-xs text-slate-900 font-heading shrink-0">
                    ₹{p.price?.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-400">Incoming deliveries waiting for preparation & dispatch</p>
            </div>
            <Link href="/seller/orders" className="px-4 py-2 bg-navy-900 hover:bg-sport-orange text-white rounded-xl text-xs font-bold transition-all">
              Manage Orders & Status
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">#{order.orderNumber || order.id}</td>
                    <td className="p-3">{order.deliveryAddress?.fullName || 'Local Athlete'}</td>
                    <td className="p-3">{order.items?.length || 1} sports item(s)</td>
                    <td className="p-3 font-black text-slate-900 font-heading">₹{order.grandTotal}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href="/seller/orders"
                        className="text-xs font-bold text-sport-orange hover:underline inline-flex items-center gap-1"
                      >
                        <span>Update</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Product Add Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateProduct}
      />
    </div>
  );
}
