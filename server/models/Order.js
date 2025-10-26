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
    images: [{ type: String }],
    trackingStatus: {
      type: String,
      enum: ['Stitching', 'Stitched', 'Out for Delivery', 'Delivered'],
      default: 'Stitching'
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  shippingAddress: { 
    type: Object, 
    required: true 
  },
  measurements: { 
    type: Object, 
    default: {} 
  },
  // Store any uploaded measurement/design files (decoded binary)
  measurementsFiles: [
    {
      productId: { type: Number },
      filename: { type: String },
      data: { type: Buffer },
      contentType: { type: String },
      size: { type: Number }
    }
  ],
  // Proof of payment (image) stored as binary in DB
  proof: {
    filename: { type: String },
    data: { type: Buffer },
    contentType: { type: String },
    size: { type: Number }
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