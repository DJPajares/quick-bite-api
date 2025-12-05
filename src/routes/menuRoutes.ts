import express from 'express';
import {
  getAllMenuItems,
  getMenuByCategory,
  getMenuItem
} from '../controllers/menuController';

const router: express.Router = express.Router();

router.get('/', getAllMenuItems);
router.get('/category/:category', getMenuByCategory);
router.get('/:id', getMenuItem);

export default router;
