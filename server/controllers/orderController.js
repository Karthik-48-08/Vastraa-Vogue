const Order = require('../models/Order');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, measurements, totalAmount, paymentMethod } = req.body;
    const userId = req.user.userId; // From authMiddleware

    const newOrder = new Order({
      user: userId,
      products,
      shippingAddress,
      measurements,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order.' });
  }
};

// Get all orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId }).sort({ orderDate: -1 }); // Newest first
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders.' });
  }
};