'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { addToCart } from '../../store/cartSlice';
import { addToast } from '../../store/toastSlice';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import {
  PackageCheck,
  Truck,
  Store,
  Calendar,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2
} from 'lucide-react';

const TABS = ['All', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function MyOrdersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const handleBuyAgain = (item) => {
    dispatch(addToCart({
      id: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      shopId: item.shopId
    }));
    dispatch(addToast({
      type: 'success',
      title: 'Added to Cart 🛒',
      message: item.name
    }));
    router.push('/cart');
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Processing') return ['Order Placed', 'Seller Accepted', 'Preparing', 'Packed'].includes(o.orderStatus);
    return o.orderStatus.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-heading">My Sports Orders</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track local gear deliveries and manage past purchases in Tiptur
            </p>
          </div>

          <Link
            href="/shop"
            className="px-5 py-2.5 bg-navy-900 hover:bg-sport-orange text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse h-40"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/90 shadow-sm max-w-md mx-auto">
            <PackageCheck className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-base text-slate-900 mb-1">No Orders Found</h3>
            <p className="text-xs text-slate-500 mb-6">You haven&apos;t placed any orders in this category yet.</p>
            <Link
              href="/shop"
              className="px-6 py-2.5 bg-sport-orange text-white rounded-xl text-xs font-bold shadow-glow-orange hover:bg-sport-orangeHover transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const orderId = order.id || order.orderNumber;
              const isDelivered = order.orderStatus === 'Delivered';
              const isCancelled = order.orderStatus === 'Cancelled';

              return (
                <div key={orderId} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                  {/* Order Top Bar */}
                  <div className="bg-slate-50/80 p-4 sm:px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Order ID</span>
                        <span className="font-black text-slate-900">#{order.orderNumber || orderId}</span>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Placed On</span>
                        <span className="font-medium text-slate-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Fulfilling Store</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Store className="w-3.5 h-3.5 text-sport-orange" />
                          {order.shopName || 'Local Sports Store'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                      isDelivered
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCancelled
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-orange-100 text-orange-900 border border-orange-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isDelivered ? 'bg-emerald-500' : isCancelled ? 'bg-rose-500' : 'bg-sport-orange animate-ping'}`}></span>
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-slate-100">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200"}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Qty: <strong>{item.quantity}</strong> • ₹{item.price?.toLocaleString('en-IN')} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleBuyAgain(item)}
                            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 transition-colors"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Buy Again</span>
                          </button>
                          <span className="font-black text-xs text-slate-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="bg-slate-50/40 p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Total: <strong className="text-base text-slate-900 font-heading font-black">₹{order.grandTotal?.toLocaleString('en-IN')}</strong> ({order.paymentMethod})
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track-order/${orderId}`}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Live Tracking</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
