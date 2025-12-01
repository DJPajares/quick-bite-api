import express from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware';

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

// Apply authentication middleware to all admin routes
router.use(authenticateAdmin);

// Orders Management
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

// Menu Management
router.get('/menu', getAllMenuItems);
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Inventory Management
router.get('/inventory', getAllInventory);
router.patch('/inventory/:id', updateInventoryStock);

// Analytics
router.get('/analytics/dashboard', getDashboardAnalytics);

export default router;
