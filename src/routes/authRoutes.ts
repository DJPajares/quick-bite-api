import express from 'express';
import rateLimit from 'express-rate-limit';
import { adminLogin, getCurrentUser } from '../controllers/authController';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router: express.Router = express.Router();

/**
 * Rate limiter for login endpoint
 * Prevents brute force attacks by limiting login attempts
 * 5 attempts per 15 minutes per IP address
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: 'Too many login attempts',
    message: 'Please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false // Disable `X-RateLimit-*` headers
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login with username and password
 * @access  Public
 */
router.post('/admin/login', loginLimiter, adminLogin);

/**
 * @route   GET /api/auth/admin/me
 * @desc    Get current authenticated admin user
 * @access  Private (requires JWT token)
 */
router.get('/admin/me', authenticateAdmin, getCurrentUser);

export default router;
