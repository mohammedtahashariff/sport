'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Home, ShoppingBag, MapPin, PackageCheck, User, Sparkles } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const totalCartItems = useSelector((state) => state.cart.totalItems);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Hide mobile nav in seller dashboard views
  if (pathname.startsWith('/seller')) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'Nearby', href: '/nearby', icon: MapPin },
    { label: 'AI Picks', href: '/recommendations', icon: Sparkles },
    { label: 'Orders', href: '/orders', icon: PackageCheck },
    { label: 'Profile', href: isAuthenticated ? '/profile' : '/login', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-navy-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-sport-orange font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.label === 'Shop' && totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sport-orange absolute bottom-0.5"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
