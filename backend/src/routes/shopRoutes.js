const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', shopController.getAllShops);
router.get('/nearby', shopController.getNearbyShops);
router.get('/:id', shopController.getShopById);
router.put('/:id', authenticate, requireRole(['seller', 'admin']), shopController.updateShop);

module.exports = router;
