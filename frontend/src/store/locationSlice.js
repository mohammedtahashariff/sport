import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lat: 13.2575,
  lng: 76.4782,
  city: 'Tiptur',
  state: 'Karnataka',
  pincode: '572201',
  radius: 15, // km
  isDetected: false,
  permissionStatus: 'prompt', // 'prompt' | 'granted' | 'denied'
  isModalOpen: false
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setUserCoordinates: (state, action) => {
      const { lat, lng, city, isDetected } = action.payload;
      state.lat = lat;
      state.lng = lng;
      if (city) state.city = city;
      state.isDetected = isDetected !== undefined ? isDetected : true;
      state.permissionStatus = 'granted';
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_location', JSON.stringify({
          lat, lng, city: state.city, radius: state.radius
        }));
      }
    },
    setRadius: (state, action) => {
      state.radius = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_radius', action.payload);
      }
    },
    setCity: (state, action) => {
      const cityData = action.payload;
      state.city = cityData.city;
      state.lat = cityData.lat;
      state.lng = cityData.lng;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sportkart_location', JSON.stringify({
          lat: cityData.lat, lng: cityData.lng, city: cityData.city, radius: state.radius
        }));
      }
    },
    setPermissionStatus: (state, action) => {
      state.permissionStatus = action.payload;
    },
    setLocationModalOpen: (state, action) => {
      state.isModalOpen = action.payload;
    }
  }
});

export const { setUserCoordinates, setRadius, setCity, setPermissionStatus, setLocationModalOpen } = locationSlice.actions;
export default locationSlice.reducer;
