// app/dashboard/layout.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiUsers, FiGift, FiCreditCard, FiSettings, FiLogOut, FiTag, FiShoppingCart, FiUser, FiBell, FiCheck } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("خطا در دریافت اعلان‌ها");
      }
    };
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/notifications/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    { name: "پیشخوان", icon: <FiHome />, path: "/dashboard" },
    { name: "پروفایل من", icon: <FiUser />, path: "/dashboard/profile" },
    { name: "کاربران", icon: <FiUsers />, path: "/dashboard/users" },
    { name: "کدهای تخفیف", icon: <FiTag />, path: "/dashboard/coupons" },
    { name: "جوایز و امتیازات", icon: <FiGift />, path: "/dashboard/rewards" },
    { name: "کیف پول", icon: <FiCreditCard />, path: "/dashboard/wallet" },
    { name: "فروشگاه تست", icon: <FiShoppingCart />, path: "/dashboard/store" },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans" dir="rtl">
      {/* سایدبار */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col p-6 z-30"
      >
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#B026FF]">
            ARATIC
          </h2>
          <p className="text-gray-400 text-xs mt-2 font-light tracking-wide">کلاب مشتریان ویژه</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map((item, index) => (
            <a 
              key={index}
              href={item.path}
              className="flex items-center gap-4 text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-300 group"
            >
              <span className="text-xl group-hover:text-[#00F0FF] transition-colors">{item.icon}</span>
              <span className="font-medium text-sm">{item.name}</span>
            </a>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all mt-6"
        >
          <FiLogOut className="text-xl" />
          <span className="font-medium text-sm">خروج</span>
        </button>
      </motion.aside>

      {/* محتوای اصلی */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* افکت نئونی پس‌زمینه */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#B026FF] rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none"></div>
        
        {/* نوار بالایی (Top Bar) */}
        <header className="h-20 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-20">
          <div className="text-gray-400 text-sm">
            امروز: {new Date().toLocaleDateString('fa-IR')}
          </div>
          
          <div className="flex items-center gap-6 relative">
            {/* زنگوله اعلان‌ها */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="text-gray-300 hover:text-white relative p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <FiBell size={24} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-[#FF3366] rounded-full border-2 border-[#050505]"></span>
                )}
              </button>

              {/* منوی کشویی اعلان‌ها */}
              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-4 w-80 bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                      <h3 className="font-bold text-white">اعلان‌های شما</h3>
                      <button onClick={handleMarkAsRead} className="text-xs text-[#00F0FF] hover:underline flex items-center gap-1">
                        <FiCheck /> خواندن همه
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-center text-gray-500 p-6 text-sm">هیچ اعلانی ندارید.</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-white/5 ${n.isRead ? 'opacity-50' : 'bg-[#B026FF]/5'}`}>
                            <h4 className={`text-sm ${n.isRead ? 'text-gray-400' : 'text-white font-bold'}`}>{n.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* آواتار کاربر در هدر */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#B026FF] flex items-center justify-center font-bold text-white shadow-lg">
                V
              </div>
            </div>
          </div>
        </header>

        {/* ناحیه اسکرول‌خور صفحات */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}