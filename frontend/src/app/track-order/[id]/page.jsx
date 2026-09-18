'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { useSocket } from '../../../context/SocketContext';
import { addToast } from '../../../store/toastSlice';
import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import MobileNav from '../../../components/common/MobileNav';
import OrderTimeline from '../../../components/customer/OrderTimeline';
import {
  Truck,
  MapPin,
  Phone,
  Store,
  Clock,
  ShieldCheck,
  ChevronRight,
  Package,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id;
  const dispatch = useDispatch();
  const socket = useSocket();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await api.getOrderById(orderId);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Real-time Socket.io listener for live order status
  useEffect(() => {
    if (socket && orderId) {
      socket.emit('join_order', orderId);

      const handleStatusUpdate = (data) => {
        if (data.orderId === orderId || data.order?.id === orderId || data.order?.orderNumber === orderId) {
          setOrder((prev) => ({
            ...prev,
            ...data.order,
            orderStatus: data.status,
            statusTimeline: data.order?.statusTimeline || prev?.statusTimeline
          }));

          dispatch(addToast({
            type: 'success',
            title: `Order Status Updated! ⚡`,
            message: `Your order is now: ${data.status}`
          }));
        }
      };

      socket.on('order:statusUpdated', handleStatusUpdate);

      return () => {
        socket.off('order:statusUpdated', handleStatusUpdate);
      };
    }
  }, [socket, orderId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center flex items-center justify-center">
          <p className="text-sm font-bold text-slate-600">Connecting to Real-Time Satellite Tracking...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
          <Link href="/orders" className="px-6 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold">
            Back to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/orders" className="hover:text-slate-700">Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">Live Tracking #{order.orderNumber || orderId}</span>
        </div>

        {/* Live Status Header Card */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Live WebSocket Channel Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Order #{order.orderNumber || orderId}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Fulfilling Store: <strong className="text-white">{order.shopName || 'Local Sports Store'}</strong>
              </p>
            </div>

            {/* Estimated Arrival Banner */}
            <div className="p-4 rounded-2xl bg-navy-800/80 border border-navy-700 text-right sm:text-right w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 block uppercase font-bold">Estimated Arrival</span>
              <span className="text-xl font-black text-sport-orange font-heading">
                {order.estimatedDeliveryTime || '25-35 Minutes'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Timeline */}
          <div className="lg:col-span-7">
            <OrderTimeline currentStatus={order.orderStatus} timeline={order.statusTimeline || []} />
          </div>

          {/* Right: Store & Delivery Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Store & Contact Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-sport-orange" />
                  <span>Local Sports Retailer</span>
                </h3>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                  Verified Tiptur Shop
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900">{order.shopName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{order.shopAddress || 'B.H. Road, Tiptur'}</p>
                <a
                  href={`tel:${order.shopPhone || '+919845122345'}`}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-sport-orange" />
                  <span>Call Store Owner ({order.shopPhone || '+91 98451 22345'})</span>
                </a>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address</span>
              </h3>
              <p className="font-bold text-slate-900">
                {order.deliveryAddress?.fullName} ({order.deliveryAddress?.phone})
              </p>
              <p className="text-slate-600">
                {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
              </p>
            </div>

            {/* Ordered Items Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span>Total Paid ({order.paymentMethod}):</span>
                <span className="text-base font-black text-slate-900 font-heading">₹{order.grandTotal?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
