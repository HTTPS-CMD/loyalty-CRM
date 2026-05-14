// backend/controllers/coupon.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ۱. ساخت کوپن جدید (فقط برای ادمین)
export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, expirationDays, usageLimit } = req.body;

    // بررسی تکراری نبودن کد تخفیف
    const existingCoupon = await prisma.coupon.findUnique({ where: { code } });
    if (existingCoupon) {
      return res.status(400).json({ message: "این کد تخفیف قبلاً ساخته شده است!" });
    }

    // محاسبه تاریخ انقضا (تبدیل تعداد روز به تاریخ دقیق)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + Number(expirationDays));

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(), // کد همیشه با حروف بزرگ ذخیره شود
        discountPercent: Number(discountPercent),
        expirationDate: expirationDate,
        usageLimit: Number(usageLimit),
      }
    });

    res.status(201).json({ message: "کد تخفیف با موفقیت ساخته شد.", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در ساخت کد تخفیف." });
  }
};

// ۲. دریافت لیست تمام کوپن‌ها (برای ادمین)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { expirationDate: 'desc' }
    });
    res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در دریافت لیست کوپن‌ها." });
  }
};