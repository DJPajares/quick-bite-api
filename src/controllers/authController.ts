import { Request, Response } from 'express';
import AdminUser from '../models/AdminUser';
import { generateToken } from '../utils/jwtUtils';

/**
 * Admin login endpoint
 * POST /api/auth/admin/login
 *
 * Request body: { username: string, password: string }
 * Response: { token: string, user: { id, username, name, role } }
 */
export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res.status(400).json({
        error: 'Validation error',
        message: 'Username and password are required'
      });
      return;
    }

    // Find user by username
    const user = await AdminUser.findOne({ username: username.toLowerCase() });

    if (!user) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        error: 'Account disabled',
        message:
          'Your account has been disabled. Please contact an administrator.'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    });

    // Return success response
    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role
      }
    });

    // Log successful login (for audit trail)
    console.log(
      `✅ Admin login: ${user.username} (${
        user.role
      }) - ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred during login. Please try again.'
    });
  }
};

/**
 * Get current authenticated user
 * GET /api/auth/admin/me
 *
 * Response: { user: { id, username, name, role } }
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // User info is attached to req by the auth middleware
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    const user = await AdminUser.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('❌ Get current user error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'An error occurred while fetching user data'
    });
  }
};
