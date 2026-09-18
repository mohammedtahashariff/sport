const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, orderController.createOrder);
router.get('/', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.put('/:id/status', authenticate, orderController.updateOrderStatus);

module.exports = router;
