import express from 'express';
import {
  submitOrder,
  getOrder,
  getOrdersBySession,
  getOrdersByTable,
  updateOrderStatus
} from '../controllers/orderController';

const router = express.Router();

router.post('/submit', submitOrder);
router.get('/session/:sessionId', getOrdersBySession);
router.get('/table/:tableNumber', getOrdersByTable);
router.get('/:orderId', getOrder);
router.put('/update-status', updateOrderStatus);

export default router;
