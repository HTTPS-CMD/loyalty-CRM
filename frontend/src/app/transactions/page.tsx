// مسیر: src/app/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";

// تعریف ساختار دیتای تراکنش‌ها
interface TransactionData {
  id: number;
  customer_name: string;
  amount: number;
  transaction_type: string;
  description: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        // آدرس درست تراکنش‌ها جایگزین شد
        const res = await fetch(
          "http://127.0.0.1:8000/api/loyalty/transactions/",
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        if (res.ok) {
          const data = await res.json();
          setTransactions(data); // آپدیت استیت تراکنش‌ها
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // تابع کمکی برای فرمت کردن تاریخ و ساعت
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("fa-IR") +
      " - " +
      date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div className="page active">
      <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "20px" }}>
        📋 تاریخچه تراکنش‌ها
      </div>

      <div className="card">
        <div className="tx-list">
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "var(--gold)",
              }}
            >
              در حال بارگذاری تراکنش‌ها... ⏳
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <div className="empty-text">تراکنشی وجود ندارد</div>
            </div>
          ) : (
            transactions.map((tx) => (
              <div className="tx-item" key={tx.id}>
                {/* آیکون بر اساس نوع تراکنش (واریز یا برداشت) تغییر می‌کند */}
                <div
                  className={`tx-icon ${tx.transaction_type === "deposit" ? "earn" : "spend"}`}
                >
                  {tx.transaction_type === "deposit" ? "💰" : "📉"}
                </div>

                <div className="tx-info">
                  <div className="tx-title">
                    <strong>{tx.customer_name || "بدون نام"}</strong> —{" "}
                    {tx.description}
                  </div>
                  <div className="tx-date">{formatDate(tx.created_at)}</div>
                </div>

                <div
                  className={`tx-amount ${tx.transaction_type === "deposit" ? "earn" : "spend"}`}
                >
                  {tx.transaction_type === "deposit" ? "+" : "-"}
                  {tx.amount.toLocaleString("fa-IR")} ت
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
