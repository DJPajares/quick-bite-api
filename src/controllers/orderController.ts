import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Session from '../models/Session';
import { calculateBill } from '../utils/billCalculator';
import { IMenuItem } from '../types';

/**
 * Submit order from cart
 * POST /api/orders/submit
 */
export const submitOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId, notes = '' } = req.body;

    if (!sessionId) {
      res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
      return;
    }

    const session = await Session.findOne({
      sessionId,
      status: 'active'
    }).populate('cart.menuItem');

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Active session not found'
      });
      return;
    }

    if (session.cart.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
      return;
    }

    // Calculate totals
    const subtotal = session.getCartTotal();
    const bill = calculateBill(subtotal);

    // Prepare order items
    const orderItems = session.cart.map((item) => {
      const menuItem = item.menuItem as IMenuItem;
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions
      };
    });

    // Create order
    const order = await Order.create({
      orderNumber: Order.generateOrderNumber(),
      sessionId: session.sessionId,
      tableNumber: session.tableNumber,
      items: orderItems,
      subtotal: bill.subtotal,
      tax: bill.tax,
      serviceFee: bill.serviceFee,
      total: bill.total,
      notes
    });

    // Clear cart after order submission
    session.cart = [];
    await session.save();

    // Populate order for response
    await order.populate('items.menuItem', 'name category');

    res.status(201).json({
      success: true,
      message: 'Order submitted successfully',
      data: {
        orderNumber: order.orderNumber,
        orderId: order._id,
        tableNumber: order.tableNumber,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        serviceFee: order.serviceFee,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order by order ID
 * GET /api/orders/:orderId
 */
export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      'items.menuItem',
      'name category'
    );

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders for a session
 * GET /api/orders/session/:sessionId
 */
export const getOrdersBySession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const orders = await Order.find({ sessionId })
      .populate('items.menuItem', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders for a table
 * GET /api/orders/table/:tableNumber
 */
export const getOrdersByTable = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tableNumber } = req.params;

    const orders = await Order.find({ tableNumber })
      .populate('items.menuItem', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tableNumber: parseInt(tableNumber),
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
