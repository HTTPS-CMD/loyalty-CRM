// app/dashboard/store/page.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiShoppingCart, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // محصول فرضی برای فروشگاه
  const product = {
    name: "عینک آفتابی کلاب‌مستر کلاسیک",
    brand: "ARATIC",
    price: 1500000,
    image: "🕶️"
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("لطفاً وارد حساب شوید.");

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/create`,
        { amount: product.price, couponCode: coupon },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`خرید موفق! ${res.data.details.earnedPoints} امتیاز دریافت کردید.`, {
        style: { background: '#0B0F19', color: '#39FF14', border: '1px solid #39FF14' }
      });

      // بعد از ۳ ثانیه کاربر را به کیف پول می‌بریم تا کم شدن پول را ببیند
      setTimeout(() => router.push("/dashboard/wallet"), 3000);

    } catch (error) {
      toast.error(error.response?.data?.message || "خطا در پردازش خرید", {
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
      className="max-w-4xl mx-auto"
    >
      <Toaster position="top-center" />

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FiShoppingCart className="text-[#00F0FF]" /> فروشگاه آراتیک
        </h1>
        <p className="text-gray-400">محصولات را بخرید، از کیف پول پرداخت کنید و امتیاز بگیرید!</p>
      </header>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
        {/* تصویر محصول */}
        <div className="w-full md:w-1/2 h-64 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-8xl border border-white/5 shadow-2xl">
          {product.image}
        </div>

        {/* جزئیات و پرداخت */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h2 className="text-sm text-[#00F0FF] tracking-widest font-bold mb-1">{product.brand}</h2>
            <h3 className="text-2xl font-bold text-white">{product.name}</h3>
          </div>
          
          <div className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {product.price.toLocaleString()} <span className="text-lg text-gray-500">تومان</span>
          </div>

          <div className="bg-black/30 p-4 rounded-xl border border-white/5">
            <p className="text-sm text-gray-400 mb-2">کد تخفیف دارید؟</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="ARATIC-VIP" 
                className="flex-1 bg-transparent border border-gray-700 focus:border-[#B026FF] rounded-lg px-3 py-2 text-white outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="bg-[#39FF14]/10 border border-[#39FF14]/20 p-3 rounded-xl flex items-center gap-2 text-[#39FF14] text-sm">
            <FiCheckCircle size={18} />
            با این خرید ۱۰٪ مبلغ را به عنوان امتیاز وفاداری پس می‌گیرید.
          </div>

          <button 
            onClick={handlePurchase}
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-[#00F0FF] to-[#B026FF] rounded-xl text-white font-bold text-lg transition-transform hover:scale-[1.02] ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? "در حال پرداخت..." : "پرداخت از کیف پول"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}