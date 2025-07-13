const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving product' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    console.log('Form Data Received (Create):', req.body);
    console.log('Uploaded File:', req.file);

    const {
      name,
      theme,
      price,
      stock,
      status,
      codAvailable,
      description
    } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      theme,
      price: parseFloat(price),
      stock: parseInt(stock),
      status,
      codAvailable: codAvailable === 'true' || codAvailable === 'on', // 👈 ini perbaikan kuncinya
      description,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('CREATE error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};



// Update product
exports.updateProduct = async (req, res) => {
  try {
    console.log('Form Data Received (Update):', req.body);
    console.log('Uploaded File:', req.file);

    const { name, theme, price, stock, status, codAvailable, description } = req.body;
    const updates = {
      name,
      theme,
      price,
      stock,
      status,
      codAvailable: codAvailable === 'true' || codAvailable === 'on',
      description
    };

    if (req.file) {
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    console.error('UPDATE error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};



// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
