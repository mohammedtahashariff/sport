const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/compare', productController.compareProducts);
router.get('/:id', productController.getProductById);

// Seller/Admin protected routes
router.post('/', authenticate, requireRole(['seller', 'admin']), productController.createProduct);
router.put('/:id', authenticate, requireRole(['seller', 'admin']), productController.updateProduct);
router.delete('/:id', authenticate, requireRole(['seller', 'admin']), productController.deleteProduct);

module.exports = router;
