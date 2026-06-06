// مسیر: src/app/layout.tsx
"use client"; // این فایل را تبدیل به کلاینت کامپوننت می‌کنیم تا بتوانیم چک کنیم کاربر لاگین است یا نه

import './globals.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { ToastProvider } from './components/ToastProvider';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // بررسی وجود توکن در مرورگر
    const token = localStorage.getItem('adminToken');
    
    // اگر توکن نداشت و در صفحه لاگین نبود، پرتش کن به لاگین!
    if (!token && pathname !== '/login') {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, [pathname, router]);

  // تا زمانی که در حال چک کردن وضعیت ورود هستیم، یک صفحه سیاه نشان بده
  if (isChecking) {
    return <html lang="fa" dir="rtl"><body style={{ backgroundColor: '#0a0a0a' }}></body></html>;
  }

  // اگر صفحه لاگین است، سایدبار و تاپ‌بار را نشان نده (فقط یک بوم خالی)
  if (pathname === '/login') {
    return (
      <html lang="fa" dir="rtl">
        <body>
          <ToastProvider>
            {children}
          </ToastProvider>
        </body>
      </html>
    );
  }

  // اگر لاگین بود، کل داشبورد را نمایش بده
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ToastProvider>
          <div className="app">
            <Sidebar />
            <div className="main">
              <Topbar />
              <div className="content">
                {children}
              </div>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}