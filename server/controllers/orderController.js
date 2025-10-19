const Order = require('../models/Order');
const User = require('../models/User');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('📦 Creating new order...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User from auth:', req.user);

    const { products, shippingAddress, measurements, totalAmount, paymentMethod } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Products are required.' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required.' });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: 'Valid total amount is required.' });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newOrder = new Order({
      user: userId,
      products: products.map(product => ({
        productId: product.productId || product.id,
        name: product.name,
        price: Number(product.price),
        quantity: Number(product.quantity),
        images: product.images || []
      })),
      shippingAddress,
      measurements: measurements || {},
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'COD',
    });

    console.log('Order to be saved:', newOrder);

    const savedOrder = await newOrder.save();
    console.log('✅ Order saved successfully! Order ID:', savedOrder._id);
    
    // Populate user details in response
    const populatedOrder = await Order.findById(savedOrder._id).populate('user', 'firstName lastName email');
    
    res.status(201).json({ 
      message: 'Order placed successfully!', 
      order: populatedOrder 
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        error: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Mongoose duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate order detected'
      });
    }
    
    res.status(500).json({ 
      message: 'Error placing order.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders for the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate('user', 'firstName lastName email')
      .sort({ orderDate: -1 });
    
    console.log(`📋 Found ${orders.length} orders for user ${userId}`);
    res.status(200).json(orders);
  } catch (error) {
    console.error('❌ Fetch orders error:', error);
    res.status(500).json({ message: 'Error fetching orders.' });
  }
};