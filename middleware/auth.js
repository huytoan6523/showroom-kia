const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Không có token, truy cập bị từ chối!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_kia');
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};