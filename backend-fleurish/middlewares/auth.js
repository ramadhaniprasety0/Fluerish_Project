const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// ✅ Middleware untuk verifikasi token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Simpan user ke request
    
    // Log untuk debugging
    console.log('Authenticated user:', decoded);
    console.log('User ID from token:', decoded.id);
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ✅ Middleware untuk role-based (admin-only)
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden - Admin only' });
  }
  next();
};

// ✅ Middleware untuk role-based (user-only, optional)
const authorizeUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Forbidden - User only' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeUser
};
