'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Plus, Store, Check, Moon, Sun } from 'lucide-react';
import { addToast } from '../../store/toastSlice';

export default function SellerHeader({ title = "Dashboard", subtitle = "Manage local inventory and fulfill sports orders", onAddProduct = null }) {
  const dispatch = useDispatch();
  const { user, shop } = useSelector((state) => state.auth);
  const [isOpenToday, setIsOpenToday] = useState(shop?.isOpen !== false);

  const toggleShopStatus = () => {
    const nextState = !isOpenToday;
    setIsOpenToday(nextState);
    dispatch(addToast({
      type: nextState ? 'success' : 'warning',
      title: nextState ? 'Shop Marked Open 🟢' : 'Shop Marked Closed 🔴',
      message: nextState ? 'Your store is accepting local sports orders in Tiptur' : 'Customers will see store as temporarily closed'
    }));
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Shop Open / Closed Toggle */}
        <button
          onClick={toggleShopStatus}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all ${
            isOpenToday
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}
          title="Toggle your shop status for customers"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOpenToday ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
          <span>{isOpenToday ? 'Store Open & Accepting Orders' : 'Store Closed'}</span>
        </button>

        {/* Quick Add Product Button */}
        {onAddProduct && (
          <button
            onClick={onAddProduct}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-sport-orange hover:bg-sport-orangeHover text-white text-xs font-bold rounded-2xl transition-all shadow-glow-orange active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        )}

        {/* Merchant Profile badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name[0].toUpperCase() : 'S'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight">{user?.name || "Suresh Gowda"}</span>
            <span className="text-[10px] text-slate-400">Owner & Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
