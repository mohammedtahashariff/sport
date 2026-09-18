'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  TrendingUp,
  Store,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const SELLER_NAV_LINKS = [
  { label: 'Overview Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
  { label: 'Product Catalog', href: '/seller/products', icon: Package },
  { label: 'Inventory & Stock Alerts', href: '/seller/inventory', icon: Boxes },
  { label: 'Incoming Orders', href: '/seller/orders', icon: ShoppingCart },
  { label: 'Sales & Analytics', href: '/seller/analytics', icon: TrendingUp },
  { label: 'Shop Profile & GPS', href: '/seller/profile', icon: Store }
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, shop } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/seller/login');
  };

  return (
    <aside className="w-64 bg-navy-950 text-white flex flex-col border-r border-navy-800 shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-navy-800">
        <Link href="/seller/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sport-orange to-amber-500 flex items-center justify-center text-white shadow-glow-orange">
            <Zap className="w-5 h-5 fill-white stroke-none" />
          </div>
          <div>
            <span className="text-xl font-black font-heading tracking-tight text-white block leading-none">
              SPORT<span className="text-sport-orange">KART</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mt-1 block">
              Merchant Central
            </span>
          </div>
        </Link>
      </div>

      {/* Shop Info Card */}
      <div className="px-4 py-3 mx-4 my-4 rounded-2xl bg-navy-900 border border-navy-700/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sport-orange/20 text-sport-orange flex items-center justify-center font-bold text-xs shrink-0">
            🏬
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{shop?.name || "Chamundeshwari Sports"}</h4>
            <p className="text-[10px] text-slate-400 truncate">Tiptur, Karnataka</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {SELLER_NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-sport-orange text-white shadow-glow-orange'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-navy-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-navy-900 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-sport-cyan" />
            <span>Visit Customer Store</span>
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
