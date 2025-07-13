const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  theme: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  codAvailable: { type: Boolean, default: false },
  description: String,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
