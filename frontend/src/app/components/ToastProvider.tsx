// مسیر: src/components/ToastProvider.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// انواع رنگ‌های نوتیفیکیشن
type ToastType = 'gold' | 'green' | 'red';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState({ message: '', type: 'gold', visible: false });

  const showToast = (message: string, type: ToastType = 'gold') => {
    setToast({ message, type, visible: true });
    
    // بعد از ۳ ثانیه نوتیفیکیشن به آرامی محو می‌شود
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* HTML مربوط به نوتیفیکیشن که استایل‌های css تو روی آن می‌نشیند */}
      <div className={`toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
        {toast.type === 'green' && '✅ '}
        {toast.type === 'red' && '❌ '}
        {toast.type === 'gold' && '💎 '}
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}

// یک هوک سفارشی برای استفاده راحت‌تر در صفحات
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast باید درون ToastProvider استفاده شود');
  return context;
};