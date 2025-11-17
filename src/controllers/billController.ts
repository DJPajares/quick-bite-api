import { Request, Response, NextFunction } from 'express';
import Session from '../models/Session';
import Order from '../models/Order';
import { calculateBill } from '../utils/billCalculator';
import { IMenuItem } from '../types';

/**
 * Get current bill for a session (cart + all orders)
 * GET /api/bill/:sessionId
 */
export const getBill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId }).populate(
      'cart.menuItem',
      'name price'
    );

    if (!session) {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
      return;
    }

    // Get all orders for this session
    const orders = await Order.find({ sessionId }).populate(
      'items.menuItem',
      'name'
    );

    // Calculate cart total
    const cartSubtotal = session.getCartTotal();

    // Calculate orders total
    const ordersTotal = orders.reduce((sum, order) => sum + order.total, 0);
    const ordersSubtotal = orders.reduce(
      (sum, order) => sum + order.subtotal,
      0
    );

    // Calculate overall bill
    // const totalSubtotal = cartSubtotal + ordersSubtotal;
    const bill = calculateBill(ordersSubtotal);

    // Prepare cart items for response
    const cartItems = session.cart.map((item) => {
      const menuItem = item.menuItem as IMenuItem;
      return {
        name: menuItem.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      };
    });

    // Prepare order items for response
    const orderItems = orders.map((order) => ({
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      serviceFee: order.serviceFee,
      total: order.total,
      createdAt: order.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        tableNumber: session.tableNumber,
        cart: {
          items: cartItems,
          subtotal: cartSubtotal
        },
        orders: {
          count: orders.length,
          items: orderItems,
          total: ordersTotal
        },
        summary: {
          subtotal: bill.subtotal,
          tax: bill.tax,
          taxRate: `${(bill.taxRate * 100).toFixed(0)}%`,
          serviceFee: bill.serviceFee,
          serviceFeeRate: `${(bill.serviceFeeRate * 100).toFixed(0)}%`,
          grandTotal: bill.total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
