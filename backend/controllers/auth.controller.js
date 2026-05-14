// backend/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, referralCode } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let initialWalletBalance = 0;

    // استفاده از تراکنش برای اطمینان از انجام تمام مراحل
    const newUser = await prisma.$transaction(async (tx) => {
      let foundReferrer = null;

      // اگر کاربر جدید کد معرف وارد کرده باشد
      if (referralCode) {
        // جستجوی معرف بر اساس کد (حتی اگر فقط بخش اول کد را وارد کرده باشد)
        foundReferrer = await tx.user.findFirst({
          where: { 
            referralCode: { startsWith: referralCode.toLowerCase() } 
          }
        });

        // اگر معرف پیدا شد، جوایز را تقسیم کن
        if (foundReferrer) {
          initialWalletBalance = 50000; // ۵۰ هزار تومان شارژ هدیه برای کاربر جدید

          // دادن ۵۰۰ امتیاز به حساب شخصی که دعوت کرده است
          await tx.user.update({
            where: { id: foundReferrer.id },
            data: { pointsBalance: { increment: 500 } }
          });

          // ثبت در تاریخچه امتیازات معرف
          await tx.pointTransaction.create({
            data: {
              userId: foundReferrer.id,
              amount: 500,
              description: `پاداش دعوت از دوست (${firstName})`
            }
          });
        }
      }

      // ساخت کاربر جدید با موجودی اولیه (صفر یا ۵۰ هزار تومان)
      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          walletBalance: initialWalletBalance
        },
      });

      return createdUser;
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "ثبت‌نام با موفقیت انجام شد.",
      user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName },
      token
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "خطای سرور در ثبت‌نام" });
  }
};

export const login = async (req, res) => {
  // کدهای لاگین دقیقاً مثل قبل است
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "کاربری با این ایمیل یافت نشد." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "ایمیل یا رمز عبور اشتباه است." });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ message: "ورود موفقیت‌آمیز بود.", token });
  } catch (error) {
    res.status(500).json({ message: "خطای سرور در ورود" });
  }
};