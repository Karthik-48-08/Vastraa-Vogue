const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [{
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    images: [{ type: String }]
  }],
  shippingAddress: { 
    type: Object, 
    required: true 
  },
  measurements: { 
    type: Object, 
    default: {} 
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['UPI', 'CreditCard', 'COD'],
    default: 'COD'
  },
  status: { 
    type: String, 
    default: 'Processing' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;