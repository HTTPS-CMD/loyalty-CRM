"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      
      // ذخیره توکن در لوکال استوریج مرورگر
      localStorage.setItem("token", res.data.token);
      
      toast.success("ورود موفقیت‌آمیز بود! در حال انتقال...", {
        style: { background: '#0B0F19', color: '#39FF14', border: '1px solid #39FF14' }
      });

      // انتقال به داشبورد بعد از ۲ ثانیه
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "خطایی رخ داد!", {
        style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* افکت‌های نئونی پس‌زمینه */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#B026FF] rounded-full mix-blend-screen filter blur-[150px] opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#00F0FF] rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

      {/* کارت شیشه‌ای فرم ورود */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,240,255,0.1)] z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">خوش آمدید</h1>
          <p className="text-gray-400 text-sm">برای ورود به پنل کاربری اطلاعات خود را وارد کنید</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">ایمیل</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 focus:border-[#00F0FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">رمز عبور</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-3 text-white outline-none transition-all duration-300"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-bold rounded-xl px-4 py-3 hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-300 shadow-[0_0_20px_rgba(176,38,255,0.4)]"
          >
            ورود به سیستم
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          حساب کاربری ندارید؟ <a href="/register" className="text-[#39FF14] hover:underline">ثبت‌نام کنید</a>
        </p>
      </motion.div>
    </div>
  );
}