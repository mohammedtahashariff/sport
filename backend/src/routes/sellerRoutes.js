const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole(['seller', 'admin']));

router.get('/dashboard', sellerController.getSellerDashboard);
router.get('/analytics', sellerController.getSellerDashboard);
router.get('/inventory', sellerController.getSellerInventory);
router.put('/inventory/:id/stock', sellerController.updateQuickStock);
router.get('/orders', sellerController.getSellerOrders);

module.exports = router;
