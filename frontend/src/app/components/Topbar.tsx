// مسیر: src/components/Topbar.tsx
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    // پاک کردن توکن امنیتی از حافظه مرورگر
    localStorage.removeItem('adminToken');
    // هدایت به صفحه لاگین
    router.push('/login');
  };

  return (
    <div className="topbar">
      <div className="topbar-title">باشگاه <span>مشتریان طلایی</span></div>
      <div className="topbar-actions">
        <Link href="/add-customer" className="tbar-btn">
          <span>➕</span>
          <span className="hidden sm:inline">مشتری جدید</span>
        </Link>
        <Link href="/charge" className="tbar-btn primary">
          <span>⚡</span>
          <span className="hidden sm:inline">شارژ سریع</span>
        </Link>
        
        {/* دکمه خروج */}
        <button 
          onClick={handleLogout} 
          className="tbar-btn" 
          style={{ backgroundColor: 'rgba(255, 70, 70, 0.1)', color: 'var(--red)', border: '1px solid rgba(255, 70, 70, 0.2)' }}
        >
          <span>🚪</span>
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </div>
  );
}