'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../store/cartSlice';
import { addToast } from '../../store/toastSlice';
import { api } from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import MobileNav from '../../components/common/MobileNav';
import {
  ShieldCheck,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  Store
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items, subtotal, deliveryFee, discount, grandTotal } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { city, lat, lng } = useSelector((state) => state.location);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    fullName: user?.name || 'Ramesh Kumar',
    phone: user?.phone || '+91 98450 12345',
    addressLine: 'Near Vidya Mandir, K.R. Extension, 3rd Cross',
    city: city || 'Tiptur',
    state: 'Karnataka',
    pincode: '572201'
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Card' | 'COD'
  const [upiId, setUpiId] = useState('9845012345@okhdfcbank');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.createOrder({
        items: items.map(i => ({
          productId: i.productId,
          shopId: i.shopId,
          quantity: i.quantity,
          name: i.name,
          price: i.price,
          image: i.image
        })),
        deliveryAddress: {
          ...address,
          lat,
          lng
        },
        paymentMethod
      });

      if (res.success && res.orders && res.orders.length > 0) {
        dispatch(clearCart());
        dispatch(addToast({
          type: 'success',
          title: 'Order Placed Successfully! 🏆',
          message: `Your sports equipment order has been routed to local store.`
        }));
        router.push(`/order-success/${res.orders[0].id || res.orders[0].orderNumber}`);
      }
    } catch (err) {
      dispatch(addToast({
        type: 'error',
        title: 'Order Failed',
        message: err.message || 'Could not place order. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Checkout Header Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 font-heading">Secure Local Checkout</h1>
          <p className="text-xs text-slate-500 mt-1">
            Express delivery fulfilled directly by authentic sports retail stores in Tiptur
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 mt-6 max-w-2xl">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border text-center ${
                currentStep === 1
                  ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              1. Delivery Address
            </button>
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border text-center ${
                currentStep === 2
                  ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              2. Review Order
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all border text-center ${
                currentStep === 3
                  ? 'bg-navy-900 text-white border-navy-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              3. Payment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Content Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            {/* STEP 1: DELIVERY ADDRESS */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sport-orange" />
                    <h3 className="font-bold text-base text-slate-900">Delivery Address</h3>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl">
                    📍 Delivering in {city}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phone Number (For Rider) *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      required
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Street Address / Landmark *</label>
                    <input
                      type="text"
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      required
                      placeholder="House No., Cross, Landmark near Kalpataru College..."
                      className="w-full p-3 rounded-xl border border-slate-300 focus:border-sport-orange focus:ring-2 focus:ring-sport-orange/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City / Town</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-3.5 bg-navy-900 hover:bg-sport-orange text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Order Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: REVIEW ORDER */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Review Local Order Items</h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-sport-orange font-bold hover:underline"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Delivery Address Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <p className="font-bold text-slate-900">{address.fullName} ({address.phone})</p>
                  <p>{address.addressLine}, {address.city} - {address.pincode}</p>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                          <span className="text-[11px] text-slate-500">Qty: {item.quantity} • {item.shopName}</span>
                        </div>
                      </div>
                      <span className="font-black text-xs text-slate-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-3.5 bg-navy-900 hover:bg-sport-orange text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-base text-slate-900">Select Payment Method</h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">100% Encrypted & Secure</span>
                </div>

                {/* Payment Options Radio Cards */}
                <div className="space-y-3">
                  {/* UPI */}
                  <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-sport-orange bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                        <span className="text-xs text-slate-500">Scan QR or enter UPI VPA ID for instant payment</span>
                        {paymentMethod === 'UPI' && (
                          <div className="mt-3 flex items-center gap-2">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="yourname@upi"
                              className="p-2 rounded-lg border border-slate-300 text-xs bg-white w-64"
                            />
                            <span className="text-[11px] font-bold text-emerald-600">Verified VPA ✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-sport-orange focus:ring-sport-orange mt-1"
                    />
                  </label>

                  {/* Card */}
                  <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-sport-orange bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Credit / Debit Card</span>
                        <span className="text-xs text-slate-500">Visa, MasterCard, RuPay cards accepted securely</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Card'}
                      onChange={() => setPaymentMethod('Card')}
                      className="text-sport-orange focus:ring-sport-orange mt-1"
                    />
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-sport-orange bg-orange-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-slate-500">Pay cash or scan rider QR code upon delivery</span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-sport-orange focus:ring-sport-orange mt-1"
                    />
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    Back to Review
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-10 py-4 bg-gradient-to-r from-sport-orange to-amber-500 hover:from-sport-orangeHover hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-glow-orange flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Place Order (₹{grandTotal})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Payment Summary
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-slate-900">
                    {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="font-black text-lg text-slate-900 font-heading">Total Payable</span>
                <span className="text-2xl font-black text-slate-900 font-heading">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Hyperlocal Dispatch Notice
                </p>
                <p className="text-[11px]">
                  Local store will accept and dispatch rider immediately. Average delivery: 30-45 mins.
                </p>
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
