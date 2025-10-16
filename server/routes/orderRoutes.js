const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the security guard

// POST /api/orders (Protected Route)
router.post('/', authMiddleware, orderController.createOrder);

// GET /api/orders/myorders (Protected Route)
router.get('/myorders', authMiddleware, orderController.getMyOrders);

module.exports = router;