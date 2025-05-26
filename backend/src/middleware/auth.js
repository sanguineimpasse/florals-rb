const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token (use the same secret used when generating the token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request object for access in route handlers
    req.user = decoded;

    next(); // Proceed to next middleware or route
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
