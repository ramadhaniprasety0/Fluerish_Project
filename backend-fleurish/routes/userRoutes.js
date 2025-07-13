const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil profil' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, email, phone, address, city, postalCode } = req.body;
    
    // Validasi input
    if (!name || !email) {
      return res.status(400).json({ error: 'Nama dan email wajib diisi' });
    }
    
    // Cek apakah email sudah digunakan oleh user lain
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah digunakan' });
    }
    
    // Update profil
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, 
        email, 
        phone, 
        address, 
        city, 
        postalCode 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    res.json({
      message: 'Profil berhasil diperbarui',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui profil' });
  }
});

// Update user password
router.put('/profile/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
    }
    
    // Cek password minimal 6 karakter
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password baru minimal 6 karakter' });
    }
    
    // Ambil user dengan password
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    // Verifikasi password lama
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Password lama tidak sesuai' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui password' });
  }
});

module.exports = router;