// backend/routes/notification.routes.js
import express from 'express';
import { getNotifications, markAllAsRead } from '../controllers/notification.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.put('/read', verifyToken, markAllAsRead);

export default router;