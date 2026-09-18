const memoryStore = require('../services/memoryDb');
const { calculateDistanceKm } = require('../services/geoService');

exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      shopId,
      minPrice,
      maxPrice,
      inStock,
      minRating,
      sort,
      search,
      lat,
      lng,
      radius
    } = req.query;

    let products = memoryStore.getProducts({
      category,
      brand,
      shopId,
      minPrice,
      maxPrice,
      inStock,
      minRating,
      sort,
      search
    });

    const userLat = parseFloat(lat) || 13.2575;
    const userLng = parseFloat(lng) || 76.4782;

    // Attach real calculated distance to each product based on its shop
    products = products.map(prod => {
      const shop = memoryStore.getShopById(prod.shopId);
      let distanceKm = 1.2;
      if (shop && shop.location?.coordinates) {
        distanceKm = calculateDistanceKm(userLat, userLng, shop.location.coordinates[1], shop.location.coordinates[0]);
      }
      return {
        ...prod,
        distanceKm,
        distanceText: `${distanceKm} km away`
      };
    });

    // Proximity radius filter
    if (radius) {
      const radiusKm = parseFloat(radius);
      products = products.filter(p => p.distanceKm <= radiusKm);
    }

    // Distance sorting if requested
    if (sort === 'nearest') {
      products.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;

    const product = memoryStore.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const userLat = parseFloat(lat) || 13.2575;
    const userLng = parseFloat(lng) || 76.4782;

    const shop = memoryStore.getShopById(product.shopId);
    let distanceKm = 1.2;
    if (shop && shop.location?.coordinates) {
      distanceKm = calculateDistanceKm(userLat, userLng, shop.location.coordinates[1], shop.location.coordinates[0]);
    }

    // Find other nearby shops selling the same product category / brand for local price comparison
    const otherShopsSelling = memoryStore.getProducts({ category: product.category })
      .filter(p => p.id !== product.id && p.name.toLowerCase().includes(product.brand.toLowerCase()))
      .map(p => {
        const s = memoryStore.getShopById(p.shopId);
        const sDist = s && s.location?.coordinates
          ? calculateDistanceKm(userLat, userLng, s.location.coordinates[1], s.location.coordinates[0])
          : 2.1;
        return {
          productId: p.id,
          productName: p.name,
          shopId: p.shopId,
          shopName: s ? s.name : "Nearby Sports",
          shopRating: s ? s.rating : 4.5,
          price: p.price,
          stock: p.stock,
          distanceKm: sDist,
          distanceText: `${sDist} km away`
        };
      })
      .slice(0, 4);

    const reviews = memoryStore.getReviewsByProduct(product.id);

    res.json({
      success: true,
      product: {
        ...product,
        distanceKm,
        distanceText: `${distanceKm} km away`,
        otherShopsSelling,
        reviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      description,
      images,
      price,
      discount,
      stock,
      sku,
      specifications
    } = req.body;

    const shopId = req.user.shopId || req.body.shopId;
    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Seller must have an associated shop to add products.' });
    }

    if (!name || !category || !brand || !price) {
      return res.status(400).json({ success: false, message: 'Please provide name, category, brand, and price.' });
    }

    const newProduct = memoryStore.addProduct({
      shopId,
      name,
      category,
      brand,
      description: description || '',
      images: images && images.length > 0 ? images : [
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800"
      ],
      price: parseFloat(price),
      discount: parseFloat(discount || 0),
      originalPrice: discount > 0 ? Math.round(price / (1 - discount / 100)) : parseFloat(price),
      stock: parseInt(stock || 10, 10),
      lowStockThreshold: 5,
      sku: sku || `SK-${Date.now().toString().slice(-6)}`,
      specifications: specifications || {
        material: "Standard Sports Grade",
        weight: "Standard",
        size: "Regular",
        color: "Standard",
        warranty: "Brand Warranty"
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existing = memoryStore.getProductById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role check: if seller, make sure they own the product shop
    if (req.user.role === 'seller' && existing.shopId !== req.user.shopId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit another shop\'s product.' });
    }

    if (updateData.price && updateData.discount) {
      updateData.originalPrice = Math.round(updateData.price / (1 - (updateData.discount || 0) / 100));
    }

    const updated = memoryStore.updateProduct(id, updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = memoryStore.getProductById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.user.role === 'seller' && existing.shopId !== req.user.shopId) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete another shop\'s product.' });
    }

    memoryStore.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.compareProducts = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ success: false, message: 'Provide product ids as comma-separated list' });
    }

    const idList = ids.split(',').map(s => s.trim());
    const products = idList
      .map(id => memoryStore.getProductById(id))
      .filter(Boolean);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
