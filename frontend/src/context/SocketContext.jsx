'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../services/socket';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../store/toastSlice';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const s = getSocket();
    if (s) {
      setSocket(s);

      // Join rooms if user is authenticated
      if (isAuthenticated && user) {
        s.emit('join_user', user.id || user._id);
        if (user.role === 'seller' && user.shopId) {
          s.emit('join_shop', user.shopId);
        }
      }

      // Global Notification Listener
      const handleNotification = (notif) => {
        dispatch(addToast({
          type: notif.type === 'LOW_STOCK' ? 'warning' : 'success',
          title: notif.title,
          message: notif.message
        }));
      };

      s.on('notification:new', handleNotification);

      return () => {
        s.off('notification:new', handleNotification);
      };
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
