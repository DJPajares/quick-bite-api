import express from 'express';
import { authenticateAdmin, requireRole } from '../middleware/authMiddleware';

// Order controllers
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/adminOrderController';

// Menu controllers
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/adminMenuController';

// Inventory controllers
import {
  getAllInventory,
  updateInventoryStock
} from '../controllers/adminInventoryController';

// Analytics controllers
import { getDashboardAnalytics } from '../controllers/adminAnalyticsController';

const router = express.Router();

// Apply JWT authentication middleware to all admin routes
router.use(authenticateAdmin);

/**
 * Orders Management
 * kitchen-staff: Can view and update order status
 * admin: Full access
 */
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

/**
 * Menu Management
 * admin only: Full CRUD operations
 */
router.get('/menu', requireRole('admin'), getAllMenuItems);
router.post('/menu', requireRole('admin'), createMenuItem);
router.patch('/menu/:id', requireRole('admin'), updateMenuItem);
router.delete('/menu/:id', requireRole('admin'), deleteMenuItem);

/**
 * Inventory Management
 * admin only: View and update inventory
 */
router.get('/inventory', requireRole('admin'), getAllInventory);
router.patch('/inventory/:id', requireRole('admin'), updateInventoryStock);

/**
 * Analytics
 * admin only: View dashboard analytics
 */
router.get('/analytics/dashboard', requireRole('admin'), getDashboardAnalytics);

export default router;
