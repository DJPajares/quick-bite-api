import express from 'express';
import { scanQRCode, getSession } from '../controllers/sessionController';

const router: express.Router = express.Router();

router.post('/scan', scanQRCode);
router.get('/:sessionId', getSession);

export default router;
