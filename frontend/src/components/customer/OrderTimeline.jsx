'use client';

import React from 'react';
import { Check, Clock, PackageCheck, Truck, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'Order Placed', label: 'Order Placed', icon: ShoppingBag, desc: 'Received & routed to local store' },
  { key: 'Seller Accepted', label: 'Seller Accepted', icon: ShieldCheck, desc: 'Verified by sports shop owner' },
  { key: 'Preparing', label: 'Preparing Items', icon: Clock, desc: 'Inspecting equipment & strings' },
  { key: 'Packed', label: 'Packed & Ready', icon: PackageCheck, desc: 'Tamper-proof sports packaging' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck, desc: 'Hyperlocal rider en route' },
  { key: 'Delivered', label: 'Delivered', icon: Check, desc: 'Handed over at your address' }
];

export default function OrderTimeline({ currentStatus = 'Order Placed', timeline = [] }) {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
        <AlertCircle className="w-8 h-8 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-base">This Order Was Cancelled</h4>
          <p className="text-xs text-rose-600">The seller or customer cancelled this order. Refund has been initiated.</p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STEPS.findIndex(s => s.key === currentStatus);
  const activeStepIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 text-base mb-6 flex items-center justify-between">
        <span>Real-Time Order Progress</span>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
          Live Tracking Active
        </span>
      </h3>

      {/* Progress timeline bar */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 hidden sm:block"></div>

        <div className="space-y-6">
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = idx < activeStepIdx;
            const isCurrent = idx === activeStepIdx;
            const Icon = step.icon;

            // Find matching timestamp from order timeline array
            const matchedTimelineItem = timeline.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Node icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-md'
                    : isCurrent
                    ? 'bg-sport-orange text-white shadow-glow-orange ring-4 ring-orange-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : <Icon className="w-5 h-5" />}
                </div>

                {/* Status info */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold leading-tight ${
                      isCurrent
                        ? 'text-sport-orange'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    {matchedTimelineItem && (
                      <span className="text-[11px] text-slate-400">
                        {new Date(matchedTimelineItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>

                  {matchedTimelineItem?.note && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl mt-1.5 border border-slate-100 italic">
                      &ldquo;{matchedTimelineItem.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
