'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setCredentials } from './authSlice';
import { hydrateCart } from './cartSlice';
import { hydrateWishlist } from './wishlistSlice';
import { setUserCoordinates, setRadius } from './locationSlice';

function StateHydrator({ children }) {
  useEffect(() => {
    // Hydrate Auth
    const token = localStorage.getItem('sportkart_token');
    const userStr = localStorage.getItem('sportkart_user');
    const shopStr = localStorage.getItem('sportkart_shop');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const shop = shopStr ? JSON.parse(shopStr) : null;
        store.dispatch(setCredentials({ user, token, shop }));
      } catch (e) {
        console.error('Failed to parse auth state from localStorage', e);
      }
    }

    // Hydrate Cart
    const cartStr = localStorage.getItem('sportkart_cart');
    if (cartStr) {
      try {
        store.dispatch(hydrateCart(JSON.parse(cartStr)));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }

    // Hydrate Wishlist
    const wishStr = localStorage.getItem('sportkart_wishlist');
    if (wishStr) {
      try {
        store.dispatch(hydrateWishlist(JSON.parse(wishStr)));
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
      }
    }

    // Hydrate Location
    const locStr = localStorage.getItem('sportkart_location');
    if (locStr) {
      try {
        const loc = JSON.parse(locStr);
        store.dispatch(setUserCoordinates({ lat: loc.lat, lng: loc.lng, city: loc.city, isDetected: false }));
        if (loc.radius) store.dispatch(setRadius(loc.radius));
      } catch (e) {
        console.error('Failed to parse location from localStorage', e);
      }
    }
  }, []);

  return <>{children}</>;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <StateHydrator>{children}</StateHydrator>
    </Provider>
  );
}
