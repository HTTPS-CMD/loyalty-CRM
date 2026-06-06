"use client"; // این خط به Next.js می‌گوید که این کامپوننت نیاز به تعامل کاربر دارد

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // یک تابع کمکی برای اینکه بفهمیم کدام منو فعال است
  const isActive = (path: string) => (pathname === path ? 'active' : '');

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-gem">💎</div>
        <div className="logo-title">باشگاه طلایی</div>
        <div className="logo-sub">سیستم وفاداری هوشمند</div>
      </div>
      <div className="nav">
        <div className="nav-section">اصلی</div>
        <Link href="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">داشبورد</span>
        </Link>
        <Link href="/customers" className={`nav-item ${isActive('/customers')}`}>
          <span className="nav-icon">👥</span>
          <span className="nav-label">مشتریان</span>
        </Link>
        <Link href="/add-customer" className={`nav-item ${isActive('/add-customer')}`}>
          <span className="nav-icon">➕</span>
          <span className="nav-label">ثبت مشتری</span>
        </Link>

        <div className="nav-section">مالی</div>
        <Link href="/wallet" className={`nav-item ${isActive('/wallet')}`}>
          <span className="nav-icon">💰</span>
          <span className="nav-label">کیف‌های پول</span>
        </Link>
        <Link href="/transactions" className={`nav-item ${isActive('/transactions')}`}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">تراکنش‌ها</span>
        </Link>
        <Link href="/charge" className={`nav-item ${isActive('/charge')}`}>
          <span className="nav-icon">⚡</span>
          <span className="nav-label">شارژ دستی</span>
        </Link>

        <div className="nav-section">شبکه</div>
        <Link href="/network" className={`nav-item ${isActive('/network')}`}>
          <span className="nav-icon">🌐</span>
          <span className="nav-label">شبکه معرفی</span>
        </Link>
        <Link href="/rewards" className={`nav-item ${isActive('/rewards')}`}>
          <span className="nav-icon">🎁</span>
          <span className="nav-label">قوانین پاداش</span>
        </Link>
        <Link href="/settings" className={`nav-item ${isActive('/settings')}`}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">تنظیمات</span>
        </Link>
      </div>
    </nav>
  );
}