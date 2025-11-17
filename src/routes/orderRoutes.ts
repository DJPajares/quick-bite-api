import express from 'express';
import { 
  submitOrder, 
  getOrder, 
  getOrdersBySession, 
  getOrdersByTable 
} from '../controllers/orderController';

const router = express.Router();

router.post('/submit', submitOrder);
router.get('/session/:sessionId', getOrdersBySession);
router.get('/table/:tableNumber', getOrdersByTable);
router.get('/:orderId', getOrder);

export default router;
