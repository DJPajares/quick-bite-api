import { Request, Response, NextFunction } from 'express';

/**
 * Simple authentication middleware for admin routes
 * In production, this should be replaced with proper JWT or OAuth implementation
 */
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const adminToken =
    req.headers['x-admin-token'] || req.headers['authorization'];

  if (!adminToken) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide admin token.'
    });
    return;
  }

  // For now, check against environment variable
  // In production, implement proper token validation
  const validToken = process.env.ADMIN_TOKEN || 'admin-secret-token';

  if (adminToken !== validToken && adminToken !== `Bearer ${validToken}`) {
    res.status(403).json({
      success: false,
      error: 'Invalid or expired admin token'
    });
    return;
  }

  next();
};
