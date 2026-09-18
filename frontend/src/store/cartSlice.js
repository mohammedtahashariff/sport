import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // [{ id, productId, name, price, originalPrice, image, quantity, shopId, shopName, stock }]
  totalItems: 0,
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  grandTotal: 0
};

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 && subtotal < 999 ? 40 : 0;
  const discount = subtotal > 2000 ? 150 : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);
  return { totalItems, subtotal, deliveryFee, discount, grandTotal };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const quantityToAdd = product.quantity || 1;
      const existingIndex = state.items.findIndex(item => item.productId === (product.id || product._id || product.productId));

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity = Math.min(
          state.items[existingIndex].stock || 99,
          state.items[existingIndex].quantity + quantityToAdd
        );
      } else {
        state.items.push({
          productId: product.id || product._id || product.productId,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          image: (product.images && product.images[0]) || product.image || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400",
          quantity: quantityToAdd,
          shopId: product.shopId || 'shop-1',
          shopName: product.shopName || 'Local Sports Store',
          stock: product.stock !== undefined ? product.stock : 10
        });
      }

      const totals = calculateTotals(state.items);
      Object.assign(state, totals);

      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_cart', JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.productId !== productId);
        } else {
          item.quantity = Math.min(item.stock || 99, quantity);
        }
      }
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);

      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_cart', JSON.stringify(state.items));
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(i => i.productId !== productId);
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);

      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_cart', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.subtotal = 0;
      state.deliveryFee = 0;
      state.discount = 0;
      state.grandTotal = 0;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('sportkart_cart');
      }
    },
    hydrateCart: (state, action) => {
      state.items = action.payload || [];
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, hydrateCart } = cartSlice.actions;
export default cartSlice.reducer;
