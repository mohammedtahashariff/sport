import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [] // up to 4 products to compare
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    toggleCompare: (state, action) => {
      const product = action.payload;
      const id = product.id || product._id;
      const index = state.items.findIndex(item => (item.id || item._id) === id);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        if (state.items.length >= 4) {
          state.items.shift(); // keep maximum 4 products
        }
        state.items.push(product);
      }
    },
    removeFromCompare: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => (item.id || item._id) !== id);
    },
    clearCompare: (state) => {
      state.items = [];
    }
  }
});

export const { toggleCompare, removeFromCompare, clearCompare } = comparisonSlice.actions;
export default comparisonSlice.reducer;
