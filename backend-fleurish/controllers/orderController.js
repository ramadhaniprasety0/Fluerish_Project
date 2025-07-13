const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Membuat pesanan baru
exports.createOrder = async (req, res) => {
  try {
    const { 
      name, email, address, city, postalCode, phone, 
      paymentMethod, totalAmount, items 
    } = req.body;

    // Validasi input
    if (!name || !email || !address || !city || !postalCode || !phone || !paymentMethod || !items) {
      return res.status(400).json({ message: 'Semua field harus diisi' });
    }

    // Validasi bukti pembayaran untuk metode transfer
    if (paymentMethod === 'transfer' && !req.file) {
      return res.status(400).json({ message: 'Bukti pembayaran harus diupload untuk metode transfer' });
    }

    // Parse items jika dikirim sebagai string
    let parsedItems = items;
    if (typeof items === 'string') {
      parsedItems = JSON.parse(items);
    }

    // Validasi items
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ message: 'Items tidak valid' });
    }

    // Membuat order items dengan referensi ke product
    const orderItems = parsedItems.map(item => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      imageUrl: item.imageUrl
    }));

    // Validasi stok produk sebelum membuat pesanan
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produk dengan ID ${item.productId} tidak ditemukan` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Stok produk ${product.name} tidak mencukupi. Stok tersedia: ${product.stock}, jumlah yang diminta: ${item.quantity}` 
        });
      }
    }

    // Membuat order baru
    const newOrder = new Order({
      name,
      email,
      address,
      city,
      postalCode,
      phone,
      items: orderItems,
      totalAmount,
      paymentMethod,
      // Jika ada user yang login, gunakan ID dari token, jika tidak coba gunakan ID dari form
      userId: req.user ? req.user.id : (req.body.userId || null),
      // Jika metode pembayaran transfer, simpan path file bukti pembayaran
      paymentProof: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    // Log untuk debugging
    console.log('Creating order with userId:', newOrder.userId);
    console.log('User from request:', req.user);

    // Simpan order ke database
    await newOrder.save();

    // Update stok produk
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      message: 'Pesanan berhasil dibuat',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat pesanan', error: error.message });
  }
};

// Mendapatkan semua pesanan (untuk admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan', error: error.message });
  }
};

// Mendapatkan pesanan berdasarkan ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Cek apakah user yang request adalah pemilik pesanan atau admin
    if (req.user && !req.user.isAdmin && order.userId && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Tidak diizinkan mengakses pesanan ini' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan', error: error.message });
  }
};

// Mendapatkan pesanan user yang sedang login
exports.getUserOrders = async (req, res) => {
  try {
    // Menggunakan req.user.id karena middleware auth.js menyimpan decoded token di req.user
    // dan token berisi id, bukan _id
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID tidak ditemukan' });
    }
    
    console.log('Mencari pesanan untuk user ID:', userId);
    
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log('Pesanan ditemukan:', orders.length);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pesanan', error: error.message });
  }
};

// Update status pesanan (untuk admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status harus diisi' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: 'Status pesanan berhasil diupdate',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate status pesanan', error: error.message });
  }
};