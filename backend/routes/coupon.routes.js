// backend/routes/coupon.routes.js
import express from 'express';
import { createCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// هر دو مسیر هم نیاز به لاگین دارند و هم نیاز به دسترسی مدیر (Admin)
router.post('/create', verifyToken, verifyAdmin, createCoupon);
router.get('/', verifyToken, verifyAdmin, getAllCoupons);

export default router;