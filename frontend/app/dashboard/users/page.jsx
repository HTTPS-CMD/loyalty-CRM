// app/dashboard/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FiUsers, FiShield, FiUser } from "react-icons/fi";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
        if (err.response?.status === 403) {
          toast.error("شما دسترسی مدیریت ندارید!", {
            style: { background: '#0B0F19', color: '#FF3366', border: '1px solid #FF3366' }
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
          <FiShield size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">دسترسی مسدود شد</h2>
        <p className="text-gray-400">فقط مدیران سیستم (Admin) اجازه مشاهده این صفحه را دارند.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FiUsers className="text-[#00F0FF]" /> مدیریت کاربران
          </h1>
          <p className="text-gray-400">لیست تمامی مشتریان و بررسی وضعیت کیف پول و امتیازات آن‌ها</p>
        </div>
        <div className="bg-[#00F0FF]/10 text-[#00F0FF] px-4 py-2 rounded-xl font-bold">
          تعداد کل: {users.length} نفر
        </div>
      </header>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                <th className="p-5 font-medium">کاربر</th>
                <th className="p-5 font-medium">ایمیل</th>
                <th className="p-5 font-medium">موجودی کیف پول</th>
                <th className="p-5 font-medium">امتیازات</th>
                <th className="p-5 font-medium">نقش کاربری</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">در حال بارگذاری اطلاعات...</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#B026FF] flex items-center justify-center text-white font-bold">
                          {user.firstName.charAt(0)}
                        </div>
                        <span className="text-white font-medium">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="p-5 text-gray-400" dir="ltr">{user.email}</td>
                    <td className="p-5 text-white font-mono tracking-wider">{user.walletBalance.toLocaleString()} <span className="text-xs text-[#00F0FF]">تومان</span></td>
                    <td className="p-5 text-white font-mono">{user.pointsBalance.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-[#B026FF]/20 text-[#B026FF]' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                        {user.role === 'ADMIN' ? 'مدیر سیستم' : 'مشتری'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}