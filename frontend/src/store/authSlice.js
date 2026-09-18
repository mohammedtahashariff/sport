import { createSlice } from '@reduxjs/toolkit';

// Initial state hydrated safely on client
const initialState = {
  user: null,
  token: null,
  shop: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, shop } = action.payload;
      state.user = user;
      state.token = token;
      state.shop = shop || null;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_token', token);
        localStorage.setItem('sportkart_user', JSON.stringify(user));
        if (shop) localStorage.setItem('sportkart_shop', JSON.stringify(shop));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.shop = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sportkart_token');
        localStorage.removeItem('sportkart_user');
        localStorage.removeItem('sportkart_shop');
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_user', JSON.stringify(state.user));
      }
    },
    setShop: (state, action) => {
      state.shop = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_shop', JSON.stringify(action.payload));
      }
    }
  }
});

export const { setCredentials, logout, updateUser, setShop } = authSlice.actions;
export default authSlice.reducer;
