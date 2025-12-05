import express from 'express';
import { getBill } from '../controllers/billController';

const router: express.Router = express.Router();

router.get('/:sessionId', getBill);

export default router;
