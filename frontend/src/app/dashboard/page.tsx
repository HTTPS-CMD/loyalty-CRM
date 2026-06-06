"use client";
import { useState, useEffect } from 'react';

// تعریف ساختارهای داده
interface DashboardData {
  total_customers: number;
  total_balance: number;
  total_transactions: number;
  network_size: number;
  levels: {
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
  };
  top_customers: any[];
  recent_transactions: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // گرفتن توکن از حافظه
        const token = localStorage.getItem('adminToken');
        
        const res = await fetch('http://127.0.0.1:8000/api/loyalty/dashboard/', {
          // ارسال توکن در هدر درخواست
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        if (res.ok) {
          const dashboardData = await res.json();
          setData(dashboardData);
        } else {
          // اگر توکن نامعتبر بود
          console.error("خطای دسترسی");
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات داشبورد:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fa-IR');
  };

  if (loading) {
    return (
      <div className="page active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ color: 'var(--gold)', fontSize: '18px', fontWeight: 'bold' }}>در حال بارگذاری آمارها... ⏳</div>
      </div>
    );
  }

  return (
    <div className="page active">
      {/* 1. کارت‌های آماری بالای صفحه */}
      <div className="grid-4" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{data?.total_customers.toLocaleString('fa-IR') || '۰'}</div>
          <div className="stat-label">کل مشتریان</div>
          <div className="stat-change up">↑ در حال رشد</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{data?.total_balance.toLocaleString('fa-IR') || '۰'}</div>
          <div className="stat-label">کل موجودی (تومان)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">{data?.total_transactions.toLocaleString('fa-IR') || '۰'}</div>
          <div className="stat-label">کل تراکنش‌ها</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌐</div>
          <div className="stat-value">{data?.network_size.toLocaleString('fa-IR') || '۰'}</div>
          <div className="stat-label">اندازه شبکه</div>
        </div>
      </div>

      {/* 2. لیست برترین مشتریان و آخرین تراکنش‌ها */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">🏆</div>
              برترین مشتریان (موجودی)
            </div>
          </div>
          <div className="tx-list">
            {data?.top_customers.length === 0 ? (
              <div className="empty"><div className="empty-icon">👑</div><div className="empty-text">هنوز مشتری ثبت نشده</div></div>
            ) : (
              data?.top_customers.map((c, index) => (
                <div className="tx-item" key={c.id}>
                  <div className="tx-icon earn">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index] || '👤'}</div>
                  <div className="tx-info">
                    <div className="tx-title">{c.user?.first_name || 'بدون نام'}</div>
                    <div className="tx-date">{c.phone_number} | سطح: {c.level}</div>
                  </div>
                  <div className="tx-amount earn">{c.wallet?.balance?.toLocaleString('fa-IR')} ت</div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-title-icon">📜</div>
              آخرین تراکنش‌ها
            </div>
          </div>
          <div className="tx-list">
            {data?.recent_transactions.length === 0 ? (
              <div className="empty"><div className="empty-icon">📋</div><div className="empty-text">تراکنشی وجود ندارد</div></div>
            ) : (
              data?.recent_transactions.map((tx) => (
                <div className="tx-item" key={tx.id}>
                  <div className={`tx-icon ${tx.transaction_type === 'deposit' ? 'earn' : 'spend'}`}>
                    {tx.transaction_type === 'deposit' ? '💰' : '📉'}
                  </div>
                  <div className="tx-info">
                    <div className="tx-title"><strong>{tx.customer_name}</strong></div>
                    <div className="tx-date">{tx.description} | {formatDate(tx.created_at)}</div>
                  </div>
                  <div className={`tx-amount ${tx.transaction_type === 'deposit' ? 'earn' : 'spend'}`}>
                    +{tx.amount.toLocaleString('fa-IR')} ت
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. توزیع سطوح عضویت */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">🌟</div>
            توزیع سطوح عضویت
          </div>
        </div>
        <div className="grid-4">
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ fontSize: '28px' }}>🥉</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#c87d3c' }}>{data?.levels.bronze.toLocaleString('fa-IR') || '۰'}</div>
            <div style={{ fontSize: '11px', color: 'var(--white3)' }}>برنزی</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ fontSize: '28px' }}>🥈</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#a0a8c0' }}>{data?.levels.silver.toLocaleString('fa-IR') || '۰'}</div>
            <div style={{ fontSize: '11px', color: 'var(--white3)' }}>نقره‌ای</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ fontSize: '28px' }}>🥇</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--gold)' }}>{data?.levels.gold.toLocaleString('fa-IR') || '۰'}</div>
            <div style={{ fontSize: '11px', color: 'var(--white3)' }}>طلایی</div>
          </div>
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ fontSize: '28px' }}>💎</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#b464dc' }}>{data?.levels.diamond.toLocaleString('fa-IR') || '۰'}</div>
            <div style={{ fontSize: '11px', color: 'var(--white3)' }}>الماس</div>
          </div>
        </div>
      </div>
    </div>
  );
}