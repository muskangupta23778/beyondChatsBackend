const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function getToken(req) {
  const auth = req.headers && req.headers.authorization ? req.headers.authorization : '';
  if (!auth.startsWith('Bearer ')) return '';
  return auth.slice(7).trim();
}

function checkUser(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET); // expects { id, role }
    if (!payload || payload.role !== 'user') {
      return res.status(403).json({ message: 'User access required' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function checkAdmin(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function checkUserOrAdmin(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || (payload.role !== 'user' && payload.role !== 'admin')) {
      return res.status(403).json({ message: 'User or Admin access required' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { checkUser, checkAdmin, checkUserOrAdmin };


