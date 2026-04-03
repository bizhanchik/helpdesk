const jwt = require('jsonwebtoken');

/**
 * Middleware: verifies the JWT from the Authorization header.
 * On success, attaches req.user = { id, role } for downstream use.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

/**
 * Middleware factory: restricts access to specific roles.
 * Must be used AFTER verifyToken.
 * @param {...string} roles - Allowed roles (e.g. 'admin', 'agent')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
