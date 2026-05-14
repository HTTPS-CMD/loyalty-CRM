// backend/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';

// ۱. نگهبان بررسی لاگین بودن کاربر (قبلاً داشتیم)
export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(403).json({ message: "دسترسی ممنوع! لطفاً وارد شوید." });

  const token = bearerHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // اطلاعات توکن شامل آیدی و role کاربر است
    next();
  } catch (error) {
    return res.status(401).json({ message: "توکن نامعتبر یا منقضی شده است." });
  }
};

// ۲. نگهبان جدید: بررسی اینکه آیا کاربر مدیر (Admin) است یا خیر؟
export const verifyAdmin = (req, res, next) => {
  // این نگهبان همیشه بعد از verifyToken اجرا می‌شود، پس req.user را داریم
  if (req.user && req.user.role === 'ADMIN') {
    next(); // اگر مدیر بود، اجازه عبور بده
  } else {
    res.status(403).json({ message: "دسترسی غیرمجاز! فقط مدیران سیستم اجازه دسترسی به این بخش را دارند." });
  }
};