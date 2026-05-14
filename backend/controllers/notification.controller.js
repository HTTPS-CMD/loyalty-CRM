// backend/controllers/notification.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// دریافت لیست اعلان‌های کاربر
export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10 // فقط ۱۰ اعلان آخر را می‌گیریم
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "خطا در دریافت اعلان‌ها." });
  }
};

// خوانده شدن همه اعلان‌ها
export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    });
    res.status(200).json({ message: "اعلان‌ها خوانده شدند." });
  } catch (error) {
    res.status(500).json({ message: "خطا در بروزرسانی اعلان‌ها." });
  }
};