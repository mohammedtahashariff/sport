'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../../services/api';
import { addToast } from '../../../store/toastSlice';
import { useSocket } from '../../../context/SocketContext';
import SellerHeader from '../../../components/seller/SellerHeader';
import {
  ShoppingCart,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  Phone,
  MapPin,
  Package,
  AlertCircle,
  Radio
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Order Placed',
  'Seller Accepted',
  'Preparing',
  'Packed',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export default function SellerOrdersPage() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { user, shop } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getSellerOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Listen to new incoming orders in real-time
  useEffect(() => {
    if (socket) {
      const handleNewOrder = (data) => {
        dispatch(addToast({
          type: 'success',
          title: 'New Customer Order Received! 🛒',
          message: `Order #${data.order.orderNumber} for ₹${data.order.grandTotal}`
        }));
        loadOrders();
      };

      socket.on('order:new', handleNewOrder);
      return () => {
        socket.off('order:new', handleNewOrder);
      };
    }
  }, [socket, dispatch]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, {
        status: newStatus,
        note: `Updated by store manager at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });

      if (res.success) {
        dispatch(addToast({
          type: 'success',
          title: 'Status Updated ⚡',
          message: `Order #${res.order.orderNumber || orderId} is now: ${newStatus}`
        }));
        loadOrders();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'Failed to update order status' }));
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'All') return true;
    return o.orderStatus === filterStatus;
  });

  return (
    <div>
      <SellerHeader
        title="Incoming Orders & Dispatch Management"
        subtitle="Manage order preparation, packaging, and assign hyperlocal riders"
      />

      <main className="p-8 max-w-7xl space-y-6">
        {/* Status Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Order Placed', 'Seller Accepted', 'Preparing', 'Packed', 'Out for Delivery', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Live Socket.io Sync Active</span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer & Location</th>
                  <th className="p-4">Ordered Sports Items</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Current Status</th>
                  <th className="p-4 text-right">Update Order Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">Loading incoming orders...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-slate-400">
                      <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">No orders in this status category</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const id = order.id || order._id;
                    return (
                      <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <span className="font-black text-slate-900 block font-heading">
                            #{order.orderNumber || id}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">
                            {order.deliveryAddress?.fullName || 'Local Customer'}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city}
                          </span>
                          <span className="text-[10px] text-slate-400">{order.deliveryAddress?.phone}</span>
                        </td>

                        <td className="p-4">
                          <div className="space-y-1 max-w-xs">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <img src={item.image} alt={item.name} className="w-6 h-6 rounded-md object-cover bg-slate-100 shrink-0" />
                                <span className="truncate">{item.name} <strong className="text-slate-900">x{item.quantity}</strong></span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-4 font-black text-slate-900 font-heading text-sm">
                          ₹{order.grandTotal?.toLocaleString('en-IN')}
                        </td>

                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            order.paymentMethod === 'UPI' ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-xl font-bold text-[10px] inline-flex items-center gap-1 ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-orange-100 text-orange-900 border border-orange-200'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          {/* Status Transition Select Dropdown */}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(id, e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs bg-white text-slate-800 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20 cursor-pointer shadow-sm ml-auto"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
