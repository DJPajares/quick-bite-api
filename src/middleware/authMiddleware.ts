import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        role: 'admin' | 'kitchen-staff';
      };
    }
  }
}

/**
 * JWT authentication middleware for admin routes
 * Validates JWT token and attaches user info to request
 */
export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'] as string | undefined;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'No authentication token provided'
      });
      return;
    }

    // Verify and decode token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };

    // Log admin action for audit trail
    console.log(
      `🔒 Admin action: ${decoded.username} (${decoded.role}) - ${req.method} ${req.path}`
    );

    next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Token verification failed';

    res.status(401).json({
      error: 'Authentication required',
      message: errorMessage
    });
    return;
  }
};

/**
 * Role-based authorization middleware
 * Checks if authenticated user has required role(s)
 */
export const requireRole = (
  ...allowedRoles: Array<'admin' | 'kitchen-staff'>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: 'Your role does not have access to this resource'
      });
      return;
    }

    next();
  };
};
