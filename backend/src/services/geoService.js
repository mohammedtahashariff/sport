// Geospatial Proximity and Distance Calculation Engine (Haversine Formula)

const TIPTUR_DEFAULT_COORDS = {
  lat: 13.2575,
  lng: 76.4782,
  city: "Tiptur",
  state: "Karnataka"
};

/**
 * Calculates great-circle distance between two points in Kilometers
 */
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.2; // graceful fallback distance in km

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place (e.g. 1.4 km)
}

/**
 * Augments shop list with live calculated distance from user coordinates
 */
function augmentShopsWithDistance(shops, userLat, userLng) {
  const targetLat = parseFloat(userLat) || TIPTUR_DEFAULT_COORDS.lat;
  const targetLng = parseFloat(userLng) || TIPTUR_DEFAULT_COORDS.lng;

  return shops.map(shop => {
    const coords = shop.location?.coordinates || [76.4782, 13.2575];
    const shopLng = coords[0];
    const shopLat = coords[1];
    const distanceKm = calculateDistanceKm(targetLat, targetLng, shopLat, shopLng);

    return {
      ...shop,
      distanceKm,
      distanceText: `${distanceKm} km away`
    };
  });
}

/**
 * Filters and sorts shops by proximity
 */
function getNearbyShops(shops, userLat, userLng, radiusKm = 15) {
  const augmented = augmentShopsWithDistance(shops, userLat, userLng);
  return augmented
    .filter(shop => shop.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = {
  TIPTUR_DEFAULT_COORDS,
  calculateDistanceKm,
  augmentShopsWithDistance,
  getNearbyShops
};
