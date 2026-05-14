// backend/controllers/user.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // آیدی از توکن (میدلور) گرفته شده

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        firstName: true, 
        lastName: true, 
        email: true, 
        role: true,
        walletBalance: true, 
        pointsBalance: true,
        referralCode: true
      } // فقط اطلاعات مهم را می‌فرستیم، نه پسورد را!
    });

    if (!user) {
      return res.status(404).json({ message: "کاربر یافت نشد." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در دریافت اطلاعات کاربر." });
  }
};


// اضافه کردن این تابع به انتهای فایل user.controller.js
export const getAllUsers = async (req, res) => {
  try {
    // گرفتن تمام کاربران از دیتابیس (بدون پسوردها!)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        pointsBalance: true,
        walletBalance: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' } // مرتب‌سازی از جدید به قدیم
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در دریافت لیست کاربران." });
  }
};