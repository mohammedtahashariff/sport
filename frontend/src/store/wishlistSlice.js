import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [] // array of products
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const id = product.id || product._id;
      const index = state.items.findIndex(item => (item.id || item._id) === id);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => (item.id || item._id) !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_wishlist', JSON.stringify(state.items));
      }
    },
    hydrateWishlist: (state, action) => {
      state.items = action.payload || [];
    }
  }
});

export const { toggleWishlist, removeFromWishlist, hydrateWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
