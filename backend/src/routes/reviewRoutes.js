const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.post('/', authenticate, reviewController.addReview);
router.get('/notifications', authenticate, reviewController.getNotifications);
router.put('/notifications/:id/read', authenticate, reviewController.markNotificationRead);

module.exports = router;
