// app/dashboard/rewards/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiAward, FiStar, FiGift, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RewardsPage() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // سطح‌بندی فرضی برای نمایش نوار پیشرفت
  const currentTier = "سطح نقره‌ای";
  const nextTier = "سطح طلایی";
  const pointsForNextTier = 5000;
  const progressPercentage = Math.min((points / pointsForNextTier) * 100, 100);

  useEffect(() => {
    const fetchRewardsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // گرفتن امتیازات کلی از API کاربر
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPoints(userRes.data.pointsBalance);

        // گرفتن تاریخچه امتیازات از API وفاداری
        const historyRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/loyalty/points/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(historyRes.data);

      } catch (error) {
        console.error("خطا در دریافت اطلاعات امتیازات", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">جوایز و امتیازات</h1>
        <p className="text-gray-400">با هر خرید امتیاز جمع کنید و از مزایای ویژه لذت ببرید</p>
      </header>

      {/* بخش نمایش سطح و امتیاز کلی */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          {/* افکت پس‌زمینه */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#B026FF] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#B026FF]/20 text-[#B026FF] rounded-xl"><FiAward size={24} /></div>
              <h2 className="text-xl font-bold text-white">وضعیت حساب شما</h2>
            </div>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">امتیاز فعلی</p>
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00F0FF]">
                  {loading ? "..." : points.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[#39FF14] font-bold text-lg">{currentTier}</p>
                <p className="text-gray-400 text-sm">{pointsForNextTier - points} امتیاز تا {nextTier}</p>
              </div>
            </div>

            {/* نوار پیشرفت (Progress Bar) */}
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-[#00F0FF] to-[#B026FF] h-3 rounded-full relative"
              >
                {/* افکت نوری روی نوار */}
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-[2px] rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* باکس جوایز سریع */}
        <div className="bg-gradient-to-br from-[#00F0FF]/10 to-[#B026FF]/10 backdrop-blur-md border border-[#00F0FF]/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:border-[#00F0FF]/40 transition-colors">
          <div className="w-16 h-16 bg-[#0B0F19] border-2 border-[#00F0FF] rounded-full flex items-center justify-center text-[#00F0FF] mb-4 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <FiGift size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">گردونه شانس</h3>
          <p className="text-gray-400 text-sm mb-4">با مصرف ۵۰۰ امتیاز، شانس خود را برای جوایز بزرگ امتحان کنید!</p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-colors">
            بزودی...
          </button>
        </div>
      </div>

      {/* لیست تاریخچه امتیازات */}
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FiClock className="text-[#00F0FF]" /> تاریخچه تراکنش‌های امتیازی
      </h3>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-400 p-8">در حال بارگذاری...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500 p-8">هنوز هیچ امتیازی ثبت نشده است.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {history.map((item) => (
              <div key={item.id} className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${item.amount > 0 ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'bg-[#FF3366]/10 text-[#FF3366]'}`}>
                    <FiStar size={20} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.description}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(item.createdAt).toLocaleDateString('fa-IR')} - {new Date(item.createdAt).toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${item.amount > 0 ? 'text-[#39FF14]' : 'text-[#FF3366]'}`} dir="ltr">
                  {item.amount > 0 ? '+' : ''}{item.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}