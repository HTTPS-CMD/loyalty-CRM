// app/dashboard/coupons/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiTag, FiPlus, FiCalendar, FiPercent } from "react-icons/fi";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "", discountPercent: "", expirationDays: "", usageLimit: ""
  });

  const fetchCoupons = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) {
      toast.error("خطا در دریافت لیست کدهای تخفیف");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data.message);
      setFormData({ code: "", discountPercent: "", expirationDays: "", usageLimit: "" });
      fetchCoupons(); // بروزرسانی لیست بعد از ساخت کوپن جدید
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در ساخت کوپن");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <Toaster position="top-center" />

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FiTag className="text-[#B026FF]" /> کدهای تخفیف آراتیک
        </h1>
        <p className="text-gray-400">تولید و مدیریت کدهای تخفیف برای جشنواره‌ها و کاربران ویژه</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فرم ساخت کوپن جدید */}
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FiPlus className="text-[#00F0FF]" /> ساخت کد جدید
          </h2>
          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">کد تخفیف (انگلیسی)</label>
              <input type="text" required value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-2 text-white outline-none" placeholder="مثلا: ARATIC2026" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">درصد تخفیف</label>
              <input type="number" required min="1" max="100" value={formData.discountPercent} onChange={(e) => setFormData({...formData, discountPercent: e.target.value})} className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-2 text-white outline-none" placeholder="مثلا: 20" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">تعداد روز اعتبار</label>
              <input type="number" required min="1" value={formData.expirationDays} onChange={(e) => setFormData({...formData, expirationDays: e.target.value})} className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-2 text-white outline-none" placeholder="مثلا: 15" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">ظرفیت استفاده (تعداد افراد)</label>
              <input type="number" required min="1" value={formData.usageLimit} onChange={(e) => setFormData({...formData, usageLimit: e.target.value})} className="w-full bg-black/30 border border-gray-700 focus:border-[#B026FF] rounded-xl px-4 py-2 text-white outline-none" placeholder="مثلا: 100" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-[#00F0FF] to-[#B026FF] text-white font-bold rounded-xl px-4 py-3 hover:opacity-90 transition-all mt-4">
              تولید کد تخفیف
            </button>
          </form>
        </div>

        {/* لیست کوپن‌های فعال */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <p className="text-gray-400">در حال بارگذاری...</p>
            ) : coupons.length === 0 ? (
              <p className="text-gray-400">هیچ کد تخفیفی ثبت نشده است.</p>
            ) : (
              coupons.map((coupon) => {
                const isExpired = new Date(coupon.expirationDate) < new Date();
                return (
                  <div key={coupon.id} className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black tracking-widest text-[#00F0FF] font-mono">{coupon.code}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${isExpired ? 'bg-red-500/20 text-red-500' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                        {isExpired ? 'منقضی شده' : 'فعال'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p className="flex items-center gap-2"><FiPercent className="text-[#B026FF]" /> میزان تخفیف: {coupon.discountPercent}٪</p>
                      <p className="flex items-center gap-2"><FiCalendar className="text-[#B026FF]" /> انقضا: {new Date(coupon.expirationDate).toLocaleDateString('fa-IR')}</p>
                      <p className="flex items-center gap-2"><FiTag className="text-[#B026FF]" /> استفاده شده: {coupon.timesUsed} از {coupon.usageLimit}</p>
                    </div>
                    {/* طرح برش کوپن روی استایل */}
                    <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full"></div>
                    <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full"></div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}