"use client";
import { useState, useEffect } from "react";

interface NetworkCustomer {
  id: number;
  name: string;
  phone: string;
  parent_id: number | null;
  balance: number;
}

export default function NetworkPage() {
  const [customers, setCustomers] = useState<NetworkCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        // آدرس درست شبکه جایگزین شد
        const res = await fetch("http://127.0.0.1:8000/api/loyalty/network/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data); // آپدیت استیت شبکه مشتریان
        }
      } catch (error) {
        console.error("خطا در دریافت اطلاعات", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // تابع بازگشتی برای پیدا کردن زیرمجموعه‌های یک مشتری
  const getChildren = (parentId: number) => {
    return customers.filter((c) => c.parent_id === parentId);
  };

  // محاسبه تعداد کل زیرمجموعه‌های یک شخص
  const countNetworkSize = (cid: number): number => {
    const children = getChildren(cid);
    let count = children.length;
    children.forEach((child) => {
      count += countNetworkSize(child.id);
    });
    return count;
  };

  // رندر کردن درختی هر نود
  const renderTreeNode = (c: NetworkCustomer, depth: number) => {
    if (depth > 3) return null; // فقط تا ۳ سطح نمایش می‌دهیم
    const children = getChildren(c.id);
    const levelClasses = ["net-l1", "net-l2", "net-l3"];
    const levelTexts = ["سطح ۱", "سطح ۲", "سطح ۳"];

    return (
      <div
        key={c.id}
        style={{
          marginBottom: "4px",
          paddingRight: depth > 0 ? "28px" : "0",
          borderRight: depth > 0 ? "1px solid rgba(201,168,76,0.15)" : "none",
          marginRight: depth > 0 ? "14px" : "0",
        }}
      >
        <div className="tree-card">
          <div style={{ fontSize: "18px" }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: 700 }}>{c.name}</div>
            <div style={{ fontSize: "11px", color: "var(--white3)" }}>
              موجودی: {c.balance.toLocaleString("fa-IR")} ت | شبکه:{" "}
              {countNetworkSize(c.id)} نفر
            </div>
          </div>
          {depth > 0 && (
            <span
              className={`net-level ${levelClasses[depth - 1] || "net-l3"}`}
            >
              {levelTexts[depth - 1] || "سطح ۳+"}
            </span>
          )}
          {children.length > 0 && (
            <span className="tag tag-green">👥 {children.length}</span>
          )}
        </div>
        {/* رندر کردن فرزندان (بازگشتی) */}
        {children.map((child) => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  // مشتریانی که خودشان هیچ معرفی ندارند (سرشاخه‌ها)
  const roots = customers.filter((c) => c.parent_id === null);

  if (loading) {
    return (
      <div
        className="page active"
        style={{ padding: "40px", textAlign: "center", color: "var(--gold)" }}
      >
        در حال ساخت شبکه... ⏳
      </div>
    );
  }

  return (
    <div className="page active">
      <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "20px" }}>
        🌐 شبکه معرفی (نتورک)
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: "18px" }}>
          <div className="card-title-icon">🌳</div>درخت شبکه مشتریان
        </div>
        <div>
          {roots.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🌐</div>
              <div className="empty-text">شبکه‌ای وجود ندارد</div>
              <div className="empty-sub">
                با ثبت مشتری و وارد کردن شماره موبایل معرف، شبکه شکل می‌گیرد
              </div>
            </div>
          ) : (
            roots.map((root) => renderTreeNode(root, 0))
          )}
        </div>
      </div>
    </div>
  );
}
