// app/dashboard/page.jsx
"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiUsers, FiDollarSign, FiAward, FiTrendingUp } from 'react-icons/fi';

const mockData = [
  { name: 'فروردین', revenue: 4000, points: 2400 },
  { name: 'اردیبهشت', revenue: 3000, points: 1398 },
  { name: 'خرداد', revenue: 9000, points: 9800 },
  { name: 'تیر', revenue: 5000, points: 3908 },
  { name: 'مرداد', revenue: 7000, points: 4800 },
];

export default function DashboardPage() {
  const stats = [
    { title: "کل مشتریان", value: "۱,۲۸۴", icon: <FiUsers />, color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10" },
    { title: "درآمد کیف پول", value: "۸۴,۵۰۰,۰۰۰ ₸", icon: <FiDollarSign />, color: "text-[#39FF14]", bg: "bg-[#39FF14]/10" },
    { title: "امتیازات داده شده", value: "۲۴,۵۰۰", icon: <FiAward />, color: "text-[#B026FF]", bg: "bg-[#B026FF]/10" },
    { title: "رشد ماهانه", value: "+۱۴٪", icon: <FiTrendingUp />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">خلاصه وضعیت سیستم</h1>
          <p className="text-gray-400">آمار و ارقام کلیدی باشگاه مشتریان در یک نگاه</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-medium">مدیر سیستم</p>
            <p className="text-sm text-[#00F0FF]">سطح: دسترسی کامل</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F0FF] to-[#B026FF] p-[2px]">
            <div className="w-full h-full bg-[#0B0F19] rounded-full border-2 border-transparent"></div>
          </div>
        </div>
      </header>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h3 className="text-gray-400 font-medium">{stat.title}</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* نمودار */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-[400px]">
        <h3 className="text-xl font-bold text-white mb-6">نمودار درآمد و امتیازات</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
            <YAxis stroke="#888" tick={{ fill: '#888' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="revenue" name="درآمد" stroke="#00F0FF" strokeWidth={3} dot={{ r: 4, fill: '#00F0FF' }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="points" name="امتیازات" stroke="#B026FF" strokeWidth={3} dot={{ r: 4, fill: '#B026FF' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}