const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Test route to check if orders endpoint is accessible
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Orders endpoint is working!' });
});

// Test database connection route
router.get('/test-db', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const orderCount = await Order.countDocuments();
    res.json({ 
      message: 'Orders endpoint is working!',
      database: 'vastraavogue',
      orderCount: orderCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/orders (Protected Route)
router.post('/', authMiddleware, orderController.createOrder);

// GET /api/orders/myorders (Protected Route)
router.get('/myorders', authMiddleware, orderController.getMyOrders);

module.exports = router;