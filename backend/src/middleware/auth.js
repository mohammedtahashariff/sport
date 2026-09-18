const jwt = require('jsonwebtoken');
const memoryStore = require('../services/memoryDb');

const JWT_SECRET = process.env.JWT_SECRET || 'sportkart_jwt_secret_super_secure_key_2026';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const roleList = Array.isArray(roles) ? roles : [roles];
    if (!roleList.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires role: ${roleList.join(' or ')}` });
    }
    next();
  };
};

module.exports = {
  authenticate,
  requireRole,
  JWT_SECRET
};
