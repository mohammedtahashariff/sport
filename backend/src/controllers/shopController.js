const memoryStore = require('../services/memoryDb');
const { getNearbyShops, augmentShopsWithDistance, calculateDistanceKm } = require('../services/geoService');

exports.getAllShops = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    let shops = memoryStore.getShops();

    if (lat && lng) {
      shops = augmentShopsWithDistance(shops, lat, lng);
    } else {
      shops = augmentShopsWithDistance(shops, 13.2575, 76.4782);
    }

    // Attach product count to each shop
    shops = shops.map(s => {
      const prods = memoryStore.getProducts({ shopId: s.id });
      return {
        ...s,
        productCount: prods.length,
        startingPrice: prods.length > 0 ? Math.min(...prods.map(p => p.price)) : 299
      };
    });

    res.json({
      success: true,
      count: shops.length,
      shops
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNearbyShops = async (req, res) => {
  try {
    const { lat = 13.2575, lng = 76.4782, radius = 15, openOnly, minRating } = req.query;
    const allShops = memoryStore.getShops();

    let nearby = getNearbyShops(allShops, lat, lng, parseFloat(radius));

    if (openOnly === 'true') {
      nearby = nearby.filter(s => s.isOpen);
    }

    if (minRating) {
      nearby = nearby.filter(s => s.rating >= parseFloat(minRating));
    }

    // Add product counts and starting prices
    nearby = nearby.map(s => {
      const prods = memoryStore.getProducts({ shopId: s.id });
      return {
        ...s,
        productCount: prods.length,
        startingPrice: prods.length > 0 ? Math.min(...prods.map(p => p.price)) : 299
      };
    });

    res.json({
      success: true,
      userLocation: { lat: parseFloat(lat), lng: parseFloat(lng), city: 'Tiptur' },
      radiusKm: parseFloat(radius),
      count: nearby.length,
      shops: nearby
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat = 13.2575, lng = 76.4782 } = req.query;

    const shop = memoryStore.getShopById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    const coords = shop.location?.coordinates || [76.4782, 13.2575];
    const distanceKm = calculateDistanceKm(parseFloat(lat), parseFloat(lng), coords[1], coords[0]);

    const products = memoryStore.getProducts({ shopId: shop.id });

    res.json({
      success: true,
      shop: {
        ...shop,
        distanceKm,
        distanceText: `${distanceKm} km away`,
        productCount: products.length,
        products
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = memoryStore.getShopById(id);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    if (req.user.role === 'seller' && req.user.shopId !== id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update another shop.' });
    }

    const updated = memoryStore.updateShop(id, req.body);

    res.json({
      success: true,
      message: 'Shop updated successfully',
      shop: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
