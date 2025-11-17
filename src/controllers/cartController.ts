import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import MenuItem from '../models/MenuItem';
import { Types } from 'mongoose';

/**
 * Add item to cart
 * POST /api/cart/add
 */
export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, menuItemId, quantity = 1, specialInstructions = '' } = req.body;

    if (!sessionId || !menuItemId) {
      res.status(400).json({
        success: false,
        error: 'Session ID and Menu Item ID are required'
      });
      return;
    }

    const session = await Session.findOne({ sessionId, status: 'active' });
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Active session not found'
      });
      return;
    }

    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
      return;
    }

    if (!menuItem.available) {
      res.status(400).json({
        success: false,
        error: 'Menu item is not available'
      });
      return;
    }

    // Check if item already in cart
    const existingItemIndex = session.cart.findIndex(
      item => (item.menuItem as Types.ObjectId).toString() === menuItemId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      session.cart[existingItemIndex].quantity += quantity;
      session.cart[existingItemIndex].specialInstructions = specialInstructions || session.cart[existingItemIndex].specialInstructions;
    } else {
      // Add new item
      session.cart.push({
        menuItem: menuItemId as any,
        quantity,
        price: menuItem.price,
        specialInstructions
      });
    }

    await session.save();

    // Populate for response
    await session.populate('cart.menuItem', 'name price category image');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        sessionId: session.sessionId,
        cart: session.cart,
        cartTotal: session.getCartTotal()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update cart item quantity
 * PUT /api/cart/update
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, menuItemId, quantity } = req.body;

    if (!sessionId || !menuItemId || quantity === undefined) {
      res.status(400).json({
        success: false,
        error: 'Session ID, Menu Item ID, and quantity are required'
      });
      return;
    }

    if (quantity < 0) {
      res.status(400).json({
        success: false,
        error: 'Quantity cannot be negative'
      });
      return;
    }

    const session = await Session.findOne({ sessionId, status: 'active' });
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Active session not found'
      });
      return;
    }

    const itemIndex = session.cart.findIndex(
      item => (item.menuItem as Types.ObjectId).toString() === menuItemId
    );

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
      return;
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      session.cart.splice(itemIndex, 1);
    } else {
      session.cart[itemIndex].quantity = quantity;
    }

    await session.save();
    await session.populate('cart.menuItem', 'name price category image');

    res.status(200).json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      data: {
        sessionId: session.sessionId,
        cart: session.cart,
        cartTotal: session.getCartTotal()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove
 */
export const removeFromCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, menuItemId } = req.body;

    if (!sessionId || !menuItemId) {
      res.status(400).json({
        success: false,
        error: 'Session ID and Menu Item ID are required'
      });
      return;
    }

    const session = await Session.findOne({ sessionId, status: 'active' });
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Active session not found'
      });
      return;
    }

    session.cart = session.cart.filter(
      item => (item.menuItem as Types.ObjectId).toString() !== menuItemId
    );

    await session.save();
    await session.populate('cart.menuItem', 'name price category image');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        sessionId: session.sessionId,
        cart: session.cart,
        cartTotal: session.getCartTotal()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get cart contents
 * GET /api/cart/:sessionId
 */
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId, status: 'active' })
      .populate('cart.menuItem', 'name price category image');

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Active session not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        tableNumber: session.tableNumber,
        cart: session.cart,
        cartTotal: session.getCartTotal()
      }
    });
  } catch (error) {
    next(error);
  }
};
