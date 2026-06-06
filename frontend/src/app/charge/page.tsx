// مسیر: src/app/charge/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useToast } from '../components/ToastProvider';

interface CustomerOption {
  id: number;
  user: { first_name: string };
  phone_number: string;
}

export default function ChargePage() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [actionType, setActionType] = useState('purchase');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('http://127.0.0.1:8000/api/loyalty/customers/', {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (error) {
        showToast("خطا در دریافت لیست مشتریان", "red");
      }
    };
    fetchCustomers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCharge = async () => {
    if (!selectedCustomerId || !amount) {
      showToast("لطفاً مشتری و مبلغ را مشخص کنید.", "red");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://127.0.0.1:8000/api/loyalty/wallet/charge/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          customer_id: selectedCustomerId,
          amount: amount,
          action_type: actionType,
          note: note,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showToast(data.message, "green");
        setAmount('');
        setNote('');
      } else {
        showToast(data.error || "خطا در شارژ کیف پول", "red");
      }
    } catch (error) {
      showToast("ارتباط با سرور برقرار نشد.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>⚡ شارژ کیف پول</div>
      <div className="grid-2">
        
        <div className="card">
          <div className="card-title" style={{ marginBottom: '18px' }}>
            <div className="card-title-icon">⚡</div>شارژ بر اساس اقدام
          </div>
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>انتخاب مشتری</label>
            <select 
              value={selectedCustomerId} 
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="">-- یک مشتری انتخاب کنید --</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.user?.first_name || 'بدون نام'} ({c.phone_number})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>نوع اقدام</label>
            <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
              <option value="purchase">خرید محصول/خدمت</option>
              <option value="manual">شارژ دستی</option>
              <option value="refer">معرفی مشتری جدید</option>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>مبلغ شارژ (تومان)</label>
            <div className="input-addon">
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="10000" 
              />
              <span className="addon-label">تومان</span>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label>توضیح (اختیاری)</label>
            <input 
              type="text" 
              value={note} 
              onChange={(e) => setNote(e.target.value)} 
              placeholder="مثلاً: خرید عینک آفتابی" 
            />
          </div>
          
          <button 
            className="btn btn-gold" 
            style={{ width: '100%' }}
            onClick={handleCharge}
            disabled={loading}
          >
            {loading ? "در حال پردازش..." : "⚡ اعمال شارژ"}
          </button>
        </div>
        
        <div className="card">
          <div className="card-title" style={{ marginBottom: '18px' }}>
            <div className="card-title-icon">🎁</div>جدول پاداش‌های فعال
          </div>
          <div className="reward-rules">
            <div className="rule-item" style={{ padding: '10px 14px' }}>
              <div className="rule-emoji" style={{ fontSize: '18px' }}>🛒</div>
              <div className="rule-info"><div className="rule-title" style={{ fontSize: '13px' }}>خرید معمولی</div></div>
              <div className="rule-val" style={{ fontSize: '13px' }}>۵,۰۰۰ ت</div>
            </div>
            
            <div className="rule-item" style={{ padding: '10px 14px' }}>
              <div className="rule-emoji" style={{ fontSize: '18px' }}>💎</div>
              <div className="rule-info"><div className="rule-title" style={{ fontSize: '13px' }}>خرید بزرگ</div></div>
              <div className="rule-val" style={{ fontSize: '13px' }}>۲۰,۰۰۰ ت</div>
            </div>
            
            <div className="rule-item" style={{ padding: '10px 14px' }}>
              <div className="rule-emoji" style={{ fontSize: '18px' }}>📸</div>
              <div className="rule-info"><div className="rule-title" style={{ fontSize: '13px' }}>فالو اینستاگرام</div></div>
              <div className="rule-val" style={{ fontSize: '13px' }}>۱۵,۰۰۰ ت</div>
            </div>

            <div className="rule-item" style={{ padding: '10px 14px' }}>
              <div className="rule-emoji" style={{ fontSize: '18px' }}>👋</div>
              <div className="rule-info"><div className="rule-title" style={{ fontSize: '13px' }}>معرفی مستقیم</div></div>
              <div className="rule-val" style={{ fontSize: '13px' }}>۵۰,۰۰۰ ت</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}