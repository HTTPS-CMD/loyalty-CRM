# 💎 سیستم مدیریت باشگاه مشتریان طلایی (Golden Club CRM)

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)
![Django](https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

یک پلتفرم جامع و یکپارچه برای مدیریت ارتباط با مشتریان (CRM)، سیستم وفاداری (Loyalty Program) و بازاریابی شبکه‌ای (Referral Marketing) که مخصوص کسب‌وکارهای تخصصی (مانند فروشگاه‌های عینک) طراحی شده است. این سیستم با استفاده از گیمیفیکیشن و شبکه‌سازی، مشتریان را به بازگشت و معرفی مشتریان جدید ترغیب می‌کند.

---

## 👨‍💻 برنامه‌نویس و توسعه‌دهنده
**کامیار اسدی (Kamyar Asadi)**
- [GitHub Profile](https://github.com/kamyarasad)

---

## ✨ ویژگی‌های کلیدی پروژه (Features)

- **🔐 سیستم احراز هویت امن:** ورود مدیر با استفاده از Token-based Authentication و محافظت از تمامی مسیرهای فرانت‌اند (Route Guards).
- **📊 داشبورد آماری زنده:** نمایش نموداری و عددی کل مشتریان، حجم سرمایه، تراکنش‌ها و توزیع سطوح وفاداری.
- **🧬 پروفایلینگ پیشرفته مشتریان:** ثبت اطلاعات هویتی، تیپ شخصیتی (MBTI)، رفتار خرید و انگیزه‌های کاربر.
- **💳 مدیریت یکپارچه کیف پول:** سیستم مالی ایمن (با استفاده از Atomic Transactions) جهت شارژ، برداشت و ثبت لاگ دقیق تاریخچه مالی.
- **⭐ ارتقاء سطح پویا (Dynamic Leveling):** ارتقاء خودکار سطح مشتری (برنزی 🥉، نقره‌ای 🥈، طلایی 🥇 و الماس 💎) بر اساس موجودی لحظه‌ای کیف پول.
- **🌳 شبکه معرفی چندسطحی (MLM Network):** پیاده‌سازی سیستم رفرال و نمایش گرافیکی درخت زیرمجموعه‌ها تا ۳ سطح با استفاده از رندرینگ بازگشتی (Recursive Rendering).
- **🔔 سیستم اعلانات (Toast Notifications):** مجهز به سیستم نمایش پیام‌های پاپ‌آپ اختصاصی و سفارشی‌سازی شده.

---

## 🛠️ تکنولوژی‌ها و زبان‌های استفاده شده

این پروژه بر پایه معماری مدرن **کلاینت-سرور (Client-Server)** توسعه یافته است:

### سمت کاربر (Frontend)
- **Framework:** Next.js (React)
- **Language:** TypeScript / JavaScript
- **Styling:** Custom CSS (با الهام از کلاس‌های Tailwind و متغیرهای داینامیک)
- **Architecture:** Single Page Application (SPA)

### سمت سرور (Backend)
- **Framework:** Django & Django REST Framework (DRF)
- **Language:** Python
- **Security:** DRF TokenAuthentication

---

## 🗄️ ساختار پایگاه داده (Database)

دیتابیس این پروژه به صورت پیش‌فرض از **SQLite** استفاده می‌کند (که به راحتی قابلیت ارتقا به **PostgreSQL** را برای محیط Production دارد). جداول اصلی عبارتند از:

1. **جدول `User` (پیش‌فرض جنگو):** نگهداری نام کاربری و رمز عبور.
2. **جدول `Customer`:** ذخیره اطلاعات هویتی، شماره موبایل، سطح وفاداری (Level) و شناسه معرف (Parent ID برای ساختار درختی).
3. **جدول `Wallet`:** متصل به هر مشتری (One-to-One) جهت نگهداری موجودی اعتبارات (Balance).
4. **جدول `Transaction`:** ثبت تاریخچه دقیق واریزی‌ها و برداشت‌ها (مبلغ، نوع تراکنش، توضیحات و زمان دقیق).

---

## 📂 ساختار پوشه‌ها (Folder Structure)

```text
Golden-Club-CRM/
│
├── backend/                  # سورس کدهای بک‌اند (Django)
│   ├── core/                 # تنظیمات اصلی پروژه و روتینگ‌ها
│   ├── loyalty/              # اپلیکیشن اصلی (Models, Views, Serializers, URLs)
│   └── manage.py             # فایل مدیریت جنگو
│
└── frontend/                 # سورس کدهای فرانت‌اند (Next.js)
    ├── src/
    │   ├── app/              # صفحات پنل (داشبورد، مشتریان، کیف پول، لاگین و ...)
    │   │   ├── globals.css   # استایل‌های سراسری پروژه
    │   │   └── layout.tsx    # گارد امنیتی و ساختار اصلی قالب
    │   └── components/       # کامپوننت‌های مشترک (Sidebar, Topbar, ToastProvider)
    ├── public/               # فایل‌های استاتیک (تصاویر، آیکون‌ها)
    ├── package.json          # وابستگی‌های فرانت‌اند
    └── tsconfig.json         # تنظیمات تایپ‌اسکریپت

```
🚀 نحوه نصب و راه‌اندازی (Installation & Setup)
برای اجرای این پروژه در سیستم لوکال خود، به Node.js و Python نیاز دارید.

۱. راه‌اندازی بک‌اند (Django)
ابتدا یک ترمینال باز کرده و وارد پوشه backend شوید:

```text

# 1. ساخت محیط مجازی (Virtual Environment)
python -m venv venv

# 2. فعال‌سازی محیط مجازی
# در ویندوز:
venv\Scripts\activate
# در مک/لینوکس:
source venv/bin/activate

# 3. نصب وابستگی‌ها
pip install django djangorestframework django-cors-headers

# 4. ساخت جداول دیتابیس
python manage.py makemigrations
python manage.py migrate

# 5. ساخت اکانت ادمین (برای ورود به پنل)
python manage.py createsuperuser

# 6. اجرای سرور بک‌اند (روی پورت 8000)
python manage.py runserver

```
۲. راه‌اندازی فرانت‌اند (Next.js)
یک ترمینال جدید باز کرده و وارد پوشه frontend شوید:

```text
# 1. نصب پکیج‌ها و وابستگی‌ها
npm install
# 2. اجرای سرور توسعه فرانت‌اند (روی پورت 3000)
npm run dev
```

۳. ورود به سیستم
پس از اجرای هر دو سرور، مرورگر خود را باز کرده و به آدرس http://localhost:3000 بروید. سیستم به صورت خودکار شما را به صفحه /login هدایت می‌کند. نام کاربری و رمز عبوری که در مرحله createsuperuser ساختید را وارد کنید تا وارد داشبورد شوید.
