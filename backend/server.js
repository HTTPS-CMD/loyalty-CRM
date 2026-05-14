// backend/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import loyaltyRoutes from './routes/loyalty.routes.js';
import userRoutes from './routes/user.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import orderRoutes from './routes/order.routes.js';
import notificationRoutes from './routes/notification.routes.js';

// اجرای تنظیمات فایل .env
dotenv.config();

const app = express();

// میدلورها (Middleware)
app.use(express.json()); // برای دریافت اطلاعات JSON از فرانت‌اند
app.use(cors()); // برای اجازه دادن به فرانت‌اند جهت اتصال به بک‌اند
app.use(helmet()); // برای افزایش امنیت
app.use(morgan('dev')); // برای لاگ کردن درخواست‌ها در ترمینال

// اتصال روت‌ها
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/loyalty', loyaltyRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// اجرای سرور
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});