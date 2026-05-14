// backend/controllers/order.controller.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const { amount, couponCode } = req.body; // مبلغ اولیه سفارش و کد تخفیف (اگر باشد)
    const userId = req.user.id;

    let finalAmount = amount;
    let appliedCoupon = null;

    // ۱. بررسی کد تخفیف (اگر وارد شده باشد)
    if (couponCode) {
      appliedCoupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      
      if (!appliedCoupon) return res.status(404).json({ message: "کد تخفیف یافت نشد." });
      if (new Date(appliedCoupon.expirationDate) < new Date()) return res.status(400).json({ message: "کد تخفیف منقضی شده است." });
      if (appliedCoupon.timesUsed >= appliedCoupon.usageLimit) return res.status(400).json({ message: "ظرفیت این کد تخفیف تکمیل شده است." });

      // اعمال تخفیف
      const discountValue = (amount * appliedCoupon.discountPercent) / 100;
      finalAmount = amount - discountValue;
    }

    // ۲. بررسی موجودی کیف پول کاربر
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user.walletBalance < finalAmount) {
      return res.status(400).json({ message: "موجودی کیف پول شما برای این خرید کافی نیست. لطفاً کیف پول خود را شارژ کنید." });
    }

    // محاسبه امتیازی که کاربر از این خرید می‌گیرد (مثلا ۱۰٪ مبلغ خرید به عنوان امتیاز)
    const earnedPoints = Math.floor(finalAmount * 0.1);

    // ۳. انجام عملیات دیتابیس به صورت یکپارچه (Transaction)
    const result = await prisma.$transaction(async (tx) => {
      // الف) کسر پول از کیف پول و اضافه کردن امتیاز
      await tx.user.update({
        where: { id: userId },
        data: { 
          walletBalance: { decrement: finalAmount },
          pointsBalance: { increment: earnedPoints }
        }
      });

      // ب) ساخت سفارش
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount: finalAmount,
          status: 'COMPLETED'
        }
      });

      // ج) ثبت لاگ امتیاز
      await tx.pointTransaction.create({
        data: {
          userId,
          amount: earnedPoints,
          description: `امتیاز دریافتی از سفارش #${order.id.substring(0,6)}`
        }
      });

      // د) آپدیت تعداد استفاده کوپن (اگر استفاده شده باشد)
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { timesUsed: { increment: 1 } }
        });
      }

      return { order, earnedPoints, finalAmount };
    });

    res.status(201).json({ 
      message: "سفارش با موفقیت ثبت شد!", 
      details: result 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "خطا در ثبت سفارش." });
  }
};