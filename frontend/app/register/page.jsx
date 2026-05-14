// app/register/page.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    referralCode: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, formData);
      
      // ذخیره توکن در لوکال استوریج مرورگر
      localStorage.setItem("token", res.data.token);
      
      toast.success("ثبت‌نام با موفقیت انجام شد! در حال انتقال...", {
        style: { background: '#0B0F19', color: '#39FF14', border: '1px solid #39FF14' }
      });

      // انتقال به داشبورد بعد از ۲ ثانیه
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "خطایی در ثبت‌نام رخ داد!", {
        style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* افکت‌های نئونی پس‌زمینه */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#B026FF] rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>

      {/* کارت شیشه‌ای فرم ثبت‌نام */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(176,38,255,0.1)] z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">عضویت در آراتیک</h1>
          <p className="text-gray-400 text-sm">برای استفاده از خدمات سیستم وفاداری ثبت‌نام کنید</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">نام</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-black/30 border border-gray-700 focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300"
                placeholder="علی"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">نام خانوادگی</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-black/30 border border-gray-700 focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300"
                placeholder="محمدی"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 text-left"
              placeholder="name@example.com"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">رمز عبور</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300 text-left"
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex justify-between">
              <span>کد معرف</span>
              <span className="text-[#39FF14] text-xs">۵۰ هزار تومان اعتبار هدیه!</span>
            </label>
            <input 
              type="text" 
              name="referralCode"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full bg-black/30 border border-gray-700 focus:border-[#39FF14] rounded-xl px-4 py-3 text-[#39FF14] font-mono outline-none transition-all duration-300 text-right"
              placeholder="A7F9B : مثال"
              dir="ltr"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-4 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-bold rounded-xl px-4 py-3 hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "در حال پردازش..." : "ثبت‌نام و ورود"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          از قبل حساب کاربری دارید؟ <Link href="/login" className="text-[#00F0FF] hover:underline">وارد شوید</Link>
        </p>
      </motion.div>
    </div>
  );
}