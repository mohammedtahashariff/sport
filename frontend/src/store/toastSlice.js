import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [] // [{ id, type: 'success'|'error'|'info'|'warning', message, title }]
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info',
        title: action.payload.title || '',
        message: action.payload.message
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  }
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
