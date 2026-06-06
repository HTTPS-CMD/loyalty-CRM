"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WalletData {
  id: number;
  name: string;
  phone: string;
  level: string;
  balance: number;
  tx_count: number;
  total_earned: number;
  network_size: number;
}

// تعریف سطوح برای محاسبه نوار پیشرفت
const LEVEL_THRESHOLDS = [
  {
    name: "برنزی",
    min: 0,
    max: 499999,
    emoji: "🥉",
    color: "#c87d3c",
    className: "lv-bronze",
  },
  {
    name: "نقره‌ای",
    min: 500000,
    max: 1999999,
    emoji: "🥈",
    color: "#a0a8c0",
    className: "lv-silver",
  },
  {
    name: "طلایی",
    min: 2000000,
    max: 4999999,
    emoji: "🥇",
    color: "var(--gold)",
    className: "lv-gold",
  },
  {
    name: "الماس",
    min: 5000000,
    max: Infinity,
    emoji: "💎",
    color: "#b464dc",
    className: "lv-diamond",
  },
];

export default function WalletPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        // آدرس درست کیف‌های پول جایگزین شد
        const res = await fetch("http://127.0.0.1:8000/api/loyalty/wallets/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWallets(data); // آپدیت استیت کیف‌های پول
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // تابع محاسبه درصد پیشرفت تا سطح بعدی
  const getProgress = (balance: number) => {
    let currentLevelIndex = 0;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (balance >= LEVEL_THRESHOLDS[i].min) {
        currentLevelIndex = i;
        break;
      }
    }

    if (currentLevelIndex === LEVEL_THRESHOLDS.length - 1)
      return { pct: 100, level: LEVEL_THRESHOLDS[currentLevelIndex] };

    const current = LEVEL_THRESHOLDS[currentLevelIndex];
    const next = LEVEL_THRESHOLDS[currentLevelIndex + 1];
    const progress = balance - current.min;
    const range = next.min - current.min;
    const pct = Math.min(100, Math.round((progress / range) * 100));

    return { pct, level: current };
  };

  const filteredWallets = wallets.filter(
    (w) => w.name.includes(searchQuery) || w.phone.includes(searchQuery),
  );

  return (
    <div className="page active">
      <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "20px" }}>
        💰 کیف‌های پول
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="جستجو مشتری بر اساس نام یا موبایل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--gold)",
            }}
          >
            در حال بارگذاری کیف‌های پول... ⏳
          </div>
        ) : filteredWallets.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">💰</div>
            <div className="empty-text">کیف پولی یافت نشد</div>
          </div>
        ) : (
          filteredWallets.map((w) => {
            const { pct, level } = getProgress(w.balance);

            return (
              <div className="card" key={w.id} style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    className="avatar"
                    style={{ width: "52px", height: "52px", fontSize: "24px" }}
                  >
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 800,
                        marginBottom: "3px",
                      }}
                    >
                      {w.name}
                    </div>
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      <span className={`level-badge ${level.className}`}>
                        {level.emoji} {level.name}
                      </span>
                      <span className="tag tag-blue">{w.phone}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: 900,
                        color: "var(--gold)",
                      }}
                    >
                      {w.balance.toLocaleString("fa-IR")}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--white3)" }}>
                      موجودی (تومان)
                    </div>
                  </div>
                </div>

                <div className="wallet-stats" style={{ marginBottom: "14px" }}>
                  <div className="wallet-stat">
                    <div className="wallet-stat-val">
                      {w.total_earned.toLocaleString("fa-IR")}
                    </div>
                    <div className="wallet-stat-label">کل کسب شده</div>
                  </div>
                  <div className="wallet-stat">
                    <div className="wallet-stat-val">{w.tx_count}</div>
                    <div className="wallet-stat-label">تعداد تراکنش</div>
                  </div>
                  <div className="wallet-stat">
                    <div className="wallet-stat-val">{w.network_size}</div>
                    <div className="wallet-stat-label">شبکه مستقیم</div>
                  </div>
                </div>

                <div className="level-bar-wrap">
                  <div className="level-bar-header">
                    <span className="level-bar-title">پیشرفت به سطح بعدی</span>
                    <span className="level-bar-val">{pct}٪</span>
                  </div>
                  <div className="level-bar">
                    <div
                      className="level-bar-fill"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <Link
                    href="/charge"
                    className="btn btn-gold btn-sm"
                    style={{ marginLeft: "8px" }}
                  >
                    ⚡ شارژ سریع
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
