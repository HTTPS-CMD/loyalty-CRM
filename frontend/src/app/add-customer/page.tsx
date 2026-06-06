// مسیر: src/app/add-customer/page.tsx
"use client";

import { useState } from 'react';
import { useToast } from '../components/ToastProvider';

// داده‌های پایه برای فرم
const MBTI_TYPES = [
  {code:'INTJ',name:'معمار',emoji:'🏛️'},{code:'INTP',name:'متفکر',emoji:'💡'},
  {code:'ENTJ',name:'فرمانده',emoji:'⚔️'},{code:'ENTP',name:'مبتکر',emoji:'🔥'},
  {code:'INFJ',name:'مشاور',emoji:'🌙'},{code:'INFP',name:'آرمان‌گرا',emoji:'🌸'},
  {code:'ENFJ',name:'قهرمان',emoji:'✨'},{code:'ENFP',name:'مبارز',emoji:'🎭'},
  {code:'ISTJ',name:'بازرس',emoji:'📋'},{code:'ISFJ',name:'مدافع',emoji:'🛡️'},
  {code:'ESTJ',name:'مدیر',emoji:'💼'},{code:'ESFJ',name:'کنسول',emoji:'🤝'},
  {code:'ISTP',name:'مکانیک',emoji:'🔧'},{code:'ISFP',name:'هنرمند',emoji:'🎨'},
  {code:'ESTP',name:'کارآفرین',emoji:'🚀'},{code:'ESFP',name:'مجری',emoji:'🎉'}
];

const PERSONALITY_TRAITS = ['اجتماعی','درون‌گرا','ریسک‌پذیر','محتاط','برند محور','قیمت محور','کیفیت محور','احساسی','منطقی','تصمیم‌گیر سریع','تحلیل‌گر','وفادار','تنوع‌طلب','خلاق','کمال‌گرا','تأثیرپذیر'];
const MOTIVATIONS = ['قیمت مناسب','کیفیت بالا','تجربه لذت‌بخش','پرستیژ','راحتی','توصیه دوست','پشتیبانی عالی','نوآوری','ضمانت'];

export default function AddCustomerPage() {
  const { showToast } = useToast();

  // Stateهای اصلی فرم
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referrerPhone, setReferrerPhone] = useState(''); 
  
  // Stateهای مربوط به ویژگی‌های شخصیتی
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);

  // تابع کمکی برای انتخاب چندگانه
  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      showToast("لطفاً نام و شماره موبایل را وارد کنید.", "red");
      return;
    }

    const phoneRegex = /^[0-9۰-۹]{10,12}$/;
    if (!phoneRegex.test(phone)) {
      showToast("شماره موبایل نامعتبر است. لطفاً فقط عدد وارد کنید.", "red");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken'); // دریافت کلید
      
      const response = await fetch('http://127.0.0.1:8000/api/loyalty/customers/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}` // ارسال کلید امنیتی
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
          mbti: selectedMBTI,
          referrer_phone: referrerPhone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "green");
        setName('');
        setPhone('');
        setReferrerPhone('');
        setSelectedMBTI(null);
        setSelectedPersonality([]);
        setSelectedMotivations([]);
      } else {
        showToast(data.error, "red");
      }
    } catch (error) {
      showToast("ارتباط با سرور برقرار نشد. مطمئن شوید بک‌اند روشن است.", "red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '20px' }}>➕ ثبت مشتری جدید</div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '18px' }}>
          <div className="card-title-icon">👤</div>اطلاعات شخصی
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>نام و نام خانوادگی *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: سارا احمدی" />
          </div>
          <div className="form-group">
            <label>شماره موبایل *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx-xxx-xxxx" />
          </div>
          <div className="form-group"><label>سن</label><input type="number" placeholder="۲۸" min="10" max="90" /></div>
          <div className="form-group">
            <label>جنسیت</label>
            <select><option>زن</option><option>مرد</option></select>
          </div>
          <div className="form-group"><label>شهر</label><input type="text" placeholder="تهران" /></div>
          <div className="form-group"><label>شغل</label><input type="text" placeholder="مشاور / کارمند / ..." /></div>
          <div className="form-group">
            <label>تحصیلات</label>
            <select><option>دیپلم</option><option>کاردانی</option><option>کارشناسی</option><option>ارشد</option><option>دکترا</option></select>
          </div>
          <div className="form-group">
            <label>سطح درآمد</label>
            <select><option>کم</option><option>متوسط</option><option>بالا</option><option>خیلی بالا</option></select>
          </div>
          <div className="form-group">
            <label>شماره موبایل معرف (اختیاری)</label>
            <input type="text" value={referrerPhone} onChange={(e) => setReferrerPhone(e.target.value)} placeholder="شماره تماس شخصی که معرفی کرده" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '18px' }}>
          <div className="card-title-icon">🧬</div>تیپ شخصیتی MBTI
        </div>
        <div className="mbti-grid">
          {MBTI_TYPES.map(t => (
            <div 
              key={t.code} 
              className={`mbti-item ${selectedMBTI === t.code ? 'sel' : ''}`}
              onClick={() => setSelectedMBTI(selectedMBTI === t.code ? null : t.code)}
            >
              <div>{t.emoji}</div>
              <div className="mbti-code">{t.code}</div>
              <div className="mbti-name">{t.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '14px' }}>
          <div className="card-title-icon">🎭</div>صفات شخصیتی
        </div>
        <div className="chips">
          {PERSONALITY_TRAITS.map(trait => (
            <button 
              key={trait} 
              className={`chip ${selectedPersonality.includes(trait) ? 'sel' : ''}`}
              onClick={() => toggleSelection(trait, selectedPersonality, setSelectedPersonality)}
            >
              {trait}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '14px' }}>
          <div className="card-title-icon">💡</div>انگیزه خرید
        </div>
        <div className="chips">
          {MOTIVATIONS.map(mot => (
            <button 
              key={mot} 
              className={`chip ${selectedMotivations.includes(mot) ? 'sel' : ''}`}
              onClick={() => toggleSelection(mot, selectedMotivations, setSelectedMotivations)}
            >
              {mot}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: '18px' }}>
          <div className="card-title-icon">🛒</div>رفتار خرید
        </div>
        <div className="form-grid">
          <div className="form-group"><label>تعداد خرید در سال</label><input type="number" placeholder="۵" /></div>
          <div className="form-group"><label>میانگین مبلغ هر خرید (تومان)</label><input type="number" placeholder="۵۰۰۰۰۰" /></div>
          <div className="form-group"><label>آخرین خرید (ماه پیش)</label><input type="number" placeholder="۲" /></div>
          <div className="form-group">
            <label>کانال آشنایی</label>
            <select><option>اینستاگرام</option><option>معرفی دوست</option><option>گوگل</option><option>تبلیغات</option><option>سایت</option><option>سایر</option></select>
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>یادداشت</label>
          <textarea placeholder="ویژگی خاص، اطلاعات اضافه..."></textarea>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-gold" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "در حال پردازش... ⏳" : "✅ ثبت و ذخیره مشتری"}
        </button>
      </div>
    </div>
  );
}