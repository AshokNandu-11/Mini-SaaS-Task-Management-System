const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Access Denied: No token provided.' });
  }

  const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: 'Access Denied: Malformed token.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach decoded user payload (id, email)
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = verifyToken;
