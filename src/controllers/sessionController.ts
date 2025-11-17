import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import { SESSION_TIMEOUT_MINUTES } from '../config/constants';

/**
 * Create a new session when QR code is scanned
 * POST /api/sessions/scan
 */
export const scanQRCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber) {
      res.status(400).json({
        success: false,
        error: 'Table number is required'
      });
      return;
    }

    // Check if there's an active session for this table
    const existingSession = await Session.findOne({
      tableNumber,
      status: 'active'
    });

    if (existingSession) {
      res.status(200).json({
        success: true,
        message: 'Active session found',
        data: {
          sessionId: existingSession.sessionId,
          tableNumber: existingSession.tableNumber,
          cart: existingSession.cart,
          createdAt: existingSession.createdAt,
          expiresAt: existingSession.expiresAt
        }
      });
      return;
    }

    // Create new session
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_TIMEOUT_MINUTES);

    const session = await Session.create({
      tableNumber,
      expiresAt
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: {
        sessionId: session.sessionId,
        tableNumber: session.tableNumber,
        cart: session.cart,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get session details
 * GET /api/sessions/:sessionId
 */
export const getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId })
      .populate('cart.menuItem', 'name price category image');

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        tableNumber: session.tableNumber,
        cart: session.cart,
        status: session.status,
        cartTotal: session.getCartTotal(),
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};
