const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// Setup multer untuk upload bukti pembayaran
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-payment-' + file.originalname.replace(/\s+/g, '_'))
});

// Filter file untuk hanya menerima gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Batas ukuran file 2MB
});

// Routes untuk order
router.post('/', authenticate, upload.single('paymentProof'), createOrder); // Buat pesanan (authenticated)
router.get('/', authenticate, authorizeAdmin, getAllOrders); // Dapatkan semua pesanan (admin only)
router.get('/user', authenticate, getUserOrders); // Dapatkan pesanan user yang login
router.get('/:id', authenticate, getOrderById); // Dapatkan detail pesanan berdasarkan ID
router.patch('/:id/status', authenticate, authorizeAdmin, updateOrderStatus); // Update status pesanan (admin only)

// Log untuk debugging
console.log('Order routes initialized');

module.exports = router;