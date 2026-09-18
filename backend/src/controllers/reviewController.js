const memoryStore = require('../services/memoryDb');

exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID required' });
    }
    const reviews = memoryStore.getReviewsByProduct(productId);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    const user = memoryStore.findUserById(userId);

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating, and comment are required.' });
    }

    const review = memoryStore.addReview({
      userId,
      userName: user ? user.name : 'Customer',
      productId,
      rating: parseFloat(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = memoryStore.getNotifications(userId);
    res.json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = memoryStore.markNotificationRead(id);
    res.json({ success: true, notification: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
