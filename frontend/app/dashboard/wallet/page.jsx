// app/dashboard/wallet/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiCreditCard, FiPlus, FiCheckCircle } from "react-icons/fi";

export default function WalletPage() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // دریافت اطلاعات کاربر (مثل موجودی) به محض ورود به صفحه
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setInitialLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // قرار دادن موجودی واقعی دیتابیس روی کارت
        setBalance(res.data.walletBalance);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر", error);
        toast.error("خطا در دریافت موجودی از سرور", {
          style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChargeWallet = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("دسترسی غیرمجاز. لطفاً دوباره وارد شوید.");
      return;
    }

    if (Number(amount) < 10000) {
      toast.error("مبلغ شارژ باید بیشتر از ۱۰,۰۰۰ تومان باشد.", {
        style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/loyalty/wallet/charge`,
        { amount: Number(amount) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // آپدیت شدن موجودی بعد از شارژ موفقیت آمیز
      setBalance(res.data.newBalance);
      setAmount("");
      
      toast.success(res.data.message, {
        style: { background: '#0B0F19', color: '#39FF14', border: '1px solid #39FF14' }
      });

    } catch (error) {
      toast.error(error.response?.data?.message || "خطا در ارتباط با سرور", {
        style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <Toaster position="top-center" reverseOrder={false} />

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">کیف پول من</h1>
        <p className="text-gray-400">مدیریت موجودی و افزایش اعتبار برای خریدهای سریع‌تر</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* بخش نمایش کارت اعتباری (Aratic Card) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-3xl blur-2xl opacity-20 pointer-events-none"></div>
          
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-64 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start z-10">
              <span className="text-2xl text-white/50"><FiCreditCard /></span>
              <span className="text-white font-bold tracking-widest text-lg">ARATIC CARD</span>
            </div>
            
            <div className="z-10">
              <p className="text-gray-400 text-sm mb-1">موجودی فعلی</p>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-mono tracking-wider">
                {initialLoading ? "..." : balance.toLocaleString()} <span className="text-xl text-[#00F0FF]">تومان</span>
              </h2>
            </div>

            <div className="flex justify-between items-end z-10">
              <p className="text-gray-400 text-sm tracking-widest">**** **** **** 2026</p>
              <p className="text-[#39FF14] flex items-center gap-2 text-sm">
                <FiCheckCircle /> فعال
              </p>
            </div>
            
            {/* طرح‌های گرافیکی روی کارت */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 border-[20px] border-white/5 rounded-full"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 border-[10px] border-white/5 rounded-full"></div>
          </div>
        </div>

        {/* فرم شارژ کیف پول */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiPlus className="text-[#B026FF]" /> افزایش موجودی
          </h3>
          
          <form onSubmit={handleChargeWallet} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">مبلغ مورد نظر (تومان)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/30 border border-gray-700 focus:border-[#00F0FF] rounded-xl px-4 py-4 text-white outline-none transition-all duration-300 text-lg"
                  placeholder="مثلاً 500000"
                  min="10000"
                  required
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  تومان
                </span>
              </div>
            </div>

            {/* دکمه‌های مبالغ پیش‌فرض */}
            <div className="flex gap-3">
              {[50000, 100000, 500000].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className="flex-1 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors text-sm"
                >
                  {preset.toLocaleString()}
                </button>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-bold rounded-xl px-4 py-4 hover:opacity-90 transition-opacity transform hover:scale-[1.02] duration-300 flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "در حال پردازش..." : "پرداخت و شارژ کیف پول"}
            </button>
          </form>
        </div>

      </div>
    </motion.div>
  );
}