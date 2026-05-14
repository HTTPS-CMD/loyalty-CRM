// app/dashboard/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiCopy, FiShare2, FiStar, FiShield, FiMaximize } from "react-icons/fi";
import QRCode from "react-qr-code";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        toast.error("خطا در بارگذاری اطلاعات کاربر");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const copyToClipboard = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast.success("کد معرف در حافظه کپی شد!", {
        style: { background: '#0B0F19', color: '#39FF14', border: '1px solid #39FF14' }
      });
    }
  };

  const getTier = (points) => {
    if (points >= 10000) return { name: "آراتیک پلاتینیوم", color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/20", border: "border-[#00F0FF]" };
    if (points >= 5000) return { name: "آراتیک گلد (طلایی)", color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400" };
    if (points >= 1000) return { name: "آراتیک سیلور (نقره‌ای)", color: "text-gray-300", bg: "bg-gray-300/20", border: "border-gray-300" };
    return { name: "آراتیک برنز", color: "text-orange-400", bg: "bg-orange-400/20", border: "border-orange-400" };
  };

  if (loading) return <div className="text-center text-white mt-20">در حال بارگذاری...</div>;
  if (!user) return null;

  const userTier = getTier(user.pointsBalance);
  // دیتایی که داخل QR Code ذخیره میشه (برای اسکن توسط فروشنده)
  const qrData = JSON.stringify({ id: user.id, ref: user.referralCode });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <Toaster position="top-center" />

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FiUser className="text-[#B026FF]" /> حساب کاربری من
        </h1>
        <p className="text-gray-400">مدیریت اطلاعات شخصی، کارت دیجیتال و دعوت از دوستان</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* کارت اطلاعات شخصی */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#B026FF]/20 to-transparent"></div>
          
          <div className={`w-28 h-28 rounded-full border-4 ${userTier.border} bg-[#0B0F19] flex items-center justify-center text-5xl text-white font-bold mb-4 relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
            {user.firstName.charAt(0)}
            <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${userTier.bg} ${userTier.color} flex items-center justify-center border-2 border-[#0B0F19]`}>
              <FiStar size={14} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-1 z-10">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-400 text-sm mb-6 z-10" dir="ltr">{user.email}</p>

          <div className={`w-full py-3 rounded-xl border ${userTier.border} ${userTier.bg} ${userTier.color} font-bold tracking-wider mb-6 flex justify-center items-center gap-2`}>
            <FiShield /> {userTier.name}
          </div>

          <div className="w-full grid grid-cols-2 gap-4 text-left border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">نقش سیستم</p>
              <p className="text-sm font-bold text-white">{user.role === 'ADMIN' ? 'مدیر سیستم' : 'مشتری'}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">امتیاز کل</p>
              <p className="text-sm font-bold text-white">{user.pointsBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* بخش دعوت از دوستان (Referral) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-r from-[#00F0FF]/10 to-[#B026FF]/10 border border-[#00F0FF]/20 rounded-3xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-[#00F0FF]/20 text-[#00F0FF] rounded-2xl">
                <FiShare2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">دوستانت را به آراتیک دعوت کن!</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  کد دعوت اختصاصی خود را با دوستانتان به اشتراک بگذارید. با ثبت‌نام هر دوست، <strong className="text-[#39FF14]">۵۰۰ امتیاز</strong> به شما و <strong className="text-[#39FF14]">۵۰,۰۰۰ تومان</strong> اعتبار هدیه به کیف پول دوستتان اضافه خواهد شد.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">کد معرفی شما:</span>
                    <span className="text-white font-mono font-bold tracking-widest">{user.referralCode.split('-')[0].toUpperCase()}</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="bg-[#B026FF] hover:bg-[#9015D8] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiCopy /> کپی کد
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش جدید: کارت عضویت دیجیتال */}
      <div className="bg-gradient-to-r from-black to-[#050505] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        {/* افکت نوری پشت کارت */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#00F0FF] blur-[150px] opacity-10 pointer-events-none"></div>
        
        <div className="z-10 text-center md:text-right">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 justify-center md:justify-start">
            کارت عضویت دیجیتال VIP
          </h3>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            این بارکد اختصاصی شماست. هنگام مراجعه به فروشگاه‌های فیزیکی آراتیک، این بارکد را به فروشنده نشان دهید تا مستقیماً از تخفیف‌ها و موجودی کیف پول خود استفاده کنید.
          </p>
        </div>

        <div className="z-10 flex flex-col items-center gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <QRCode 
              value={qrData} 
              size={140} 
              bgColor="#ffffff"
              fgColor="#000000"
              level="H" // بالاترین کیفیت برای اسکن راحت‌تر
            />
          </div>
          <span className="text-[#00F0FF] text-xs flex items-center gap-1 font-mono tracking-widest uppercase">
            <FiMaximize /> اسکن در فروشگاه
          </span>
        </div>
      </div>

    </motion.div>
  );
}