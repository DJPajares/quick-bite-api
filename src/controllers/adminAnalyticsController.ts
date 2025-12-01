import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';
import { ORDER_STATUS } from '../config/constants';

/**
 * Get dashboard analytics
 * GET /api/admin/analytics/dashboard
 */
export const getDashboardAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate total orders and revenue
    const [allOrdersStats, todayOrdersStats, popularItems, recentOrders] =
      await Promise.all([
        // All-time stats
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$total' },
              avgOrderValue: { $avg: '$total' }
            }
          }
        ]),

        // Today's stats
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: today, $lt: tomorrow }
            }
          },
          {
            $group: {
              _id: null,
              todayOrders: { $sum: 1 },
              todayRevenue: { $sum: '$total' }
            }
          }
        ]),

        // Popular items (top 5)
        Order.aggregate([
          { $unwind: '$items' },
          {
            $group: {
              _id: '$items.menuItem',
              name: { $first: '$items.name' },
              totalOrdered: { $sum: '$items.quantity' },
              revenue: {
                $sum: { $multiply: ['$items.price', '$items.quantity'] }
              }
            }
          },
          { $sort: { totalOrdered: -1 } },
          { $limit: 5 },
          {
            $project: {
              _id: 1,
              name: 1,
              totalOrdered: 1,
              revenue: { $round: ['$revenue', 2] }
            }
          }
        ]),

        // Recent orders (last 10)
        Order.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .select('orderNumber tableNumber total status createdAt')
      ]);

    // Calculate status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const allStats = allOrdersStats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0
    };

    const todayStats = todayOrdersStats[0] || {
      todayOrders: 0,
      todayRevenue: 0
    };

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalOrders: allStats.totalOrders,
          totalRevenue: Math.round(allStats.totalRevenue * 100) / 100,
          averageOrderValue: Math.round(allStats.avgOrderValue * 100) / 100
        },
        today: {
          orders: todayStats.todayOrders,
          revenue: Math.round(todayStats.todayRevenue * 100) / 100
        },
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        popularItems: popularItems,
        recentOrders: recentOrders.map((order) => ({
          orderNumber: order.orderNumber,
          tableNumber: order.tableNumber,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
