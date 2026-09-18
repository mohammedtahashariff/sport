'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import SellerSidebar from '../../components/seller/SellerSidebar';
import { useSocket } from '../../context/SocketContext';

export default function SellerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const socket = useSocket();

  // Allow login and register routes without auth check
  const isAuthRoute = pathname === '/seller/login' || pathname === '/seller/register';

  useEffect(() => {
    if (!isAuthRoute && !isAuthenticated) {
      router.push('/seller/login');
    }
  }, [isAuthenticated, isAuthRoute, router]);

  // Join seller shop room for real-time order alerts
  useEffect(() => {
    if (socket && user?.shopId) {
      socket.emit('join_shop', user.shopId);
    }
  }, [socket, user]);

  if (isAuthRoute) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-100/70">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
