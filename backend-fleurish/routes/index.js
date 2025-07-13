const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { authenticate, authorizeAdmin } = require('../middlewares/auth');

// Setup multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

// 👇 ROUTES
router.get('/products', getProducts); // semua login bisa
router.post('/products', authenticate, authorizeAdmin, upload.single('image'), createProduct);
router.put('/products/:id', authenticate, authorizeAdmin, upload.single('image'), updateProduct);
router.delete('/products/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;