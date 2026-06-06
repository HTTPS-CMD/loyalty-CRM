// مسیر: src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/ToastProvider';

export default function LoginPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // جلوگیری از رفرش شدن صفحه
    
    if (!username || !password) {
      showToast("لطفاً نام کاربری و رمز عبور را وارد کنید.", "red");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/loyalty/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message, "green");
        // ذخیره توکن در حافظه مرورگر
        localStorage.setItem('adminToken', data.token);
        // هدایت به صفحه داشبورد
        router.push('/dashboard');
      } else {
        showToast(data.error || "ورود ناموفق بود", "red");
      }
    } catch (error) {
      showToast("ارتباط با سرور برقرار نشد.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-dark)',
      position: 'fixed', top: 0, left: 0, zIndex: 9999 
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', border: '1px solid rgba(201,168,76,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💎</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gold)' }}>باشگاه طلایی</h1>
          <p style={{ fontSize: '13px', color: 'var(--white3)', marginTop: '5px' }}>ورود به پنل مدیریت</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>نام کاربری (Admin)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="نام کاربری خود را وارد کنید" 
              style={{ textAlign: 'left', direction: 'ltr' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label>رمز عبور</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              style={{ textAlign: 'left', direction: 'ltr' }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-gold" 
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? 'در حال بررسی... ⏳' : 'ورود به سیستم'}
          </button>
        </form>
      </div>
    </div>
  );
}