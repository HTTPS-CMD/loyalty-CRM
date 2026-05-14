// backend/controllers/loyalty.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// API ۱: شارژ کیف پول کاربر
export const chargeWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id; // این آیدی را از نگهبان (میدلور) گرفتیم

    if (amount <= 0) {
      return res.status(400).json({ message: "مبلغ شارژ باید بیشتر از صفر باشد." });
    }

    // آپدیت موجودی کاربر در دیتابیس
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { increment: amount } } // مبلغ جدید را به قبلی اضافه می‌کند
    });

    res.status(200).json({ 
      message: "کیف پول با موفقیت شارژ شد.", 
      newBalance: updatedUser.walletBalance 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در شارژ کیف پول." });
  }
};

// API ۲: تخصیص امتیاز به کاربر (مثلا بعد از خرید)
export const awardPoints = async (req, res) => {
  try {
    const { points, description } = req.body;
    const userId = req.user.id;

    // ۱. آپدیت موجودی امتیاز کاربر
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { pointsBalance: { increment: points } }
    });

    // ۲. ثبت تاریخچه (تراکنش) امتیاز در دیتابیس
    await prisma.pointTransaction.create({
      data: {
        userId: userId,
        amount: points,
        description: description || "امتیاز هدیه سیستم"
      }
    });

    res.status(200).json({
      message: `تعداد ${points} امتیاز به حساب شما اضافه شد.`,
      totalPoints: updatedUser.pointsBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در تخصیص امتیاز." });
  }
};

export const getPointHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // گرفتن لیست تراکنش‌های امتیازی کاربر
    const history = await prisma.pointTransaction.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' } // مرتب‌سازی از جدیدترین به قدیمی‌ترین
    });

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در دریافت تاریخچه امتیازات." });
  }
};