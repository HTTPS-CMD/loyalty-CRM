# 💎 Aratic Club - Loyalty & Rewards SaaS Platform

یک پلتفرم جامع و مدرن برای مدیریت باشگاه مشتریان (Customer Loyalty System)، طراحی شده با معماری Full-Stack برای ارائه سطح بالای خدمات به کاربران و مدیریت دقیق توسط مدیران کسب‌وکار.

## 🚀 ویژگی‌های کلیدی (Features)

*   **احراز هویت امن (Authentication):** سیستم ثبت‌نام و ورود با استفاده از توکن‌های JWT و هشینگ رمز عبور با bcrypt.
*   **کنترل دسترسی (RBAC):** تفکیک کامل پنل و دسترسی‌های کاربران عادی (Customer) و مدیران سیستم (Admin).
*   **کیف پول دیجیتال (Digital Wallet):** امکان شارژ کیف پول و پرداخت مستقیم هزینه سفارشات از طریق موجودی.
*   **سیستم گیمیفیکیشن و امتیازات:** تخصیص خودکار امتیاز با هر خرید و ارتقاء سطح کاربری (برنز، نقره‌ای، طلایی و پلاتینیوم).
*   **سیستم کدهای تخفیف (Coupons):** تولید کدهای تخفیف با ظرفیت محدود و تاریخ انقضا توسط مدیر.
*   **بازاریابی بازگشتی (Referral System):** کد معرف اختصاصی برای هر کاربر جهت دعوت از دوستان و دریافت پاداش دوطرفه.
*   **کارت عضویت دیجیتال:** تولید خودکار بارکد اختصاصی (QR Code) برای هر مشتری جهت استفاده در شعب فیزیکی.
*   **رابط کاربری پریمیوم (UI/UX):** طراحی کاملاً واکنش‌گرا (Responsive) با استایل Glassmorphism و انیمیشن‌های روان.

## 🛠️ تکنولوژی‌های استفاده شده (Tech Stack)

### Frontend
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **State & Fetching:** Axios, React Hooks
*   **Icons & Components:** React-Icons, React-Hot-Toast, Recharts

### Backend
*   **Environment:** Node.js & Express.js
*   **Database:** MySQL (Relational DB)
*   **ORM:** Prisma
*   **Security:** JWT, bcryptjs, Helmet, CORS

## 💻 راهنمای نصب و راه‌اندازی (Local Setup)

ابتدا کلون کردن مخزن (Repository):
\`\`\`bash
git clone <your-repository-url>
cd loyalty-system
\`\`\`

### ۱. راه‌اندازی بک‌اند (Backend)
\`\`\`bash
cd backend
npm install
\`\`\`
*   یک فایل `.env` بسازید و مقادیر زیر را در آن قرار دهید:
    \`\`\`env
    DATABASE_URL="mysql://root:@localhost:3306/loyalty_db"
    JWT_SECRET="Your_Secret_Key"
    PORT=5001
    \`\`\`
*   اجرای مایگریشن دیتابیس و روشن کردن سرور:
    \`\`\`bash
    npx prisma db push
    npm run dev (یا npx nodemon server.js)
    \`\`\`

### ۲. راه‌اندازی فرانت‌اند (Frontend)
\`\`\`bash
cd ../frontend
npm install
\`\`\`
*   یک فایل `.env.local` بسازید و آدرس API را وارد کنید:
    \`\`\`env
    NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
    \`\`\`
*   اجرای پروژه فرانت‌اند:
    \`\`\`bash
    npm run dev
    \`\`\`
پروژه اکنون در آدرس `http://localhost:3000` در دسترس است.