import express from 'express';
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart
} from '../controllers/cartController';

const router: express.Router = express.Router();

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.get('/:sessionId', getCart);

export default router;
