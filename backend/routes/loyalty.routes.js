import express from 'express';
import { chargeWallet, awardPoints, getPointHistory } from '../controllers/loyalty.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// تمام روت‌های این فایل از میدلور verifyToken عبور می‌کنند
router.use(verifyToken);

router.post('/wallet/charge', chargeWallet);
router.post('/points/award', awardPoints);
router.get('/points/history', getPointHistory);

export default router;