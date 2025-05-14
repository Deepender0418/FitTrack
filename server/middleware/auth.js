import jwt from 'jsonwebtoken';

export default function(req, res, next) {
  // Get token from cookie
  const token = req.cookies.token;
  
  // Get token from header as fallback
  const headerToken = req.header('Authorization')?.split(' ')[1];

  // Check if no token
  if (!token && !headerToken) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token || headerToken, process.env.JWT_SECRET || 'jwtsecret');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}