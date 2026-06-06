"use client";
import { useState } from 'react';

export default function RewardsPage() {
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState({
    normalPurchase: 5000,
    bigPurchase: 20000,
    networkLevel1: 5,
  });

  const handleSave = () => {
    setLoading(true);
    // شبیه‌سازی ذخیره در دیتابیس
    setTimeout(() => {
      alert("✅ قوانین پاداش به‌روزرسانی شد.");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page active">
      <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>🎁 قوانین پاداش باشگاه</div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-title-icon">💡</div>مقادیر پاداش را تنظیم کنید
          </div>
          <button 
            className="btn btn-gold btn-sm" 
            onClick={handleSave} 
            disabled={loading}
          >
            {loading ? 'در حال ذخیره... ⏳' : '💾 ذخیره تنظیمات'}
          </button>
        </div>
        <div className="reward-rules">
           <div className="rule-item">
              <div className="rule-emoji">🛒</div>
              <div className="rule-info">
                <div className="rule-title">خرید معمولی</div>
                <div className="rule-desc">به ازای هر خرید</div>
              </div>
              <input 
                className="rule-input" 
                type="number" 
                value={rules.normalPurchase} 
                onChange={e => setRules({...rules, normalPurchase: Number(e.target.value)})} 
              />
              <span style={{ fontSize: '11px', color: 'var(--white3)' }}>تومان</span>
           </div>
           
           <div className="rule-item">
              <div className="rule-emoji">💎</div>
              <div className="rule-info">
                <div className="rule-title">خرید بزرگ</div>
                <div className="rule-desc">خرید بالای حد معین</div>
              </div>
              <input 
                className="rule-input" 
                type="number" 
                value={rules.bigPurchase} 
                onChange={e => setRules({...rules, bigPurchase: Number(e.target.value)})} 
              />
              <span style={{ fontSize: '11px', color: 'var(--white3)' }}>تومان</span>
           </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title"><div className="card-title-icon">🌐</div>پاداش شبکه نتورک (چند سطحی)</div>
        </div>
        <div className="reward-rules">
           <div className="rule-item">
              <div className="rule-emoji">🥇</div>
              <div className="rule-info">
                <div className="rule-title">سطح ۱ - خرید</div>
                <div className="rule-desc">درصد از هر خرید دوست مستقیم</div>
              </div>
              <input 
                className="rule-input" 
                type="number" 
                value={rules.networkLevel1} 
                onChange={e => setRules({...rules, networkLevel1: Number(e.target.value)})} 
              />
              <span style={{ fontSize: '11px', color: 'var(--white3)' }}>٪</span>
           </div>
        </div>
        <div className="alert" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '10px', padding: '14px', marginTop: '14px', fontSize: '13px', lineHeight: 1.8, color: 'var(--white2)' }}>
          💡 <strong>نحوه کارکرد نتورک:</strong><br/>
          وقتی مشتری A یک نفر (B) را معرفی می‌کند → A پاداش معرفی می‌گیرد.<br/>
          وقتی B خرید می‌کند → A به اندازه درصد مشخص شده از مبلغ خرید B، سود دریافت می‌کند.
        </div>
      </div>
    </div>
  );
}