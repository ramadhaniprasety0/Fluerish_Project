const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  imageUrl: String
});

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['transfer', 'cod'], 
    required: true 
  },
  paymentProof: { 
    type: String, 
    required: function() { return this.paymentMethod === 'transfer'; }
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);