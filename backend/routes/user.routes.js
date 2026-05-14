// backend/routes/user.routes.js
import express from 'express';
import { getMe, getAllUsers } from '../controllers/user.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// این روت فقط لاگین می‌خواهد (همه کاربران)
router.get('/me', verifyToken, getMe);

// این روت هم لاگین می‌خواهد و هم دسترسی ادمین!
router.get('/', verifyToken, verifyAdmin, getAllUsers);

export default router;