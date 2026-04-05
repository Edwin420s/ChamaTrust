const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

/**
 * Authentication middleware
 * Validates JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Authorization header required',
      code: 'AUTH_HEADER_MISSING'
    });
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Invalid authorization format. Use: Bearer <token>',
      code: 'AUTH_FORMAT_INVALID'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Token required',
      code: 'TOKEN_MISSING'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    // Fetch user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        trustScore: true,
        stellarPublicKey: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

module.exports = authMiddleware;