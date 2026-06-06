"use client";
import { useState } from 'react';

export default function SettingsPage() {
  const [clubName, setClubName] = useState('باشگاه مشتریان آرتیک');
  const [businessType, setBusinessType] = useState('فروشگاه عینک آفتابی و طبی');
  const [currency, setCurrency] = useState('تومان');
  const [bigPurchaseLimit, setBigPurchaseLimit] = useState(2000000);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // شبیه‌سازی ارسال به بک‌اند (بعداً با fetch به جنگو جایگزین می‌شود)
    setTimeout(() => {
      alert("✅ تنظیمات با موفقیت ذخیره شد.");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page active">
      <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>⚙️ تنظیمات سیستم</div>
      <div className="card">
        <div className="card-title" style={{ marginBottom: '18px' }}>
          <div className="card-title-icon">🏪</div>اطلاعات کسب‌وکار
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>نام باشگاه</label>
            <input 
              type="text" 
              value={clubName} 
              onChange={e => setClubName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>نوع کسب‌وکار</label>
            <input 
              type="text" 
              value={businessType} 
              onChange={e => setBusinessType(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>واحد امتیاز</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)}>
              <option>تومان</option>
              <option>امتیاز</option>
              <option>سکه</option>
            </select>
          </div>
          <div className="form-group">
            <label>حد خرید بزرگ (تومان)</label>
            <input 
              type="number" 
              value={bigPurchaseLimit} 
              onChange={e => setBigPurchaseLimit(Number(e.target.value))} 
            />
          </div>
        </div>
        <button 
          className="btn btn-gold" 
          style={{ marginTop: '16px' }} 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? 'در حال ذخیره... ⏳' : '💾 ذخیره تنظیمات'}
        </button>
      </div>
    </div>
  );
}