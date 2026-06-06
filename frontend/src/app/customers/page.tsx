// مسیر: src/app/customers/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "../components/ToastProvider";

interface CustomerData {
  id: number;
  user: {
    username: string;
    first_name: string;
  };
  phone_number: string;
  level: string; // این فیلد دیگر استفاده نمی‌شود و جای خود را به محاسبه زنده می‌دهد
  wallet: {
    balance: number;
  };
}

export default function CustomersPage() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState({
    id: 0,
    name: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(
          "http://127.0.0.1:8000/api/loyalty/customers/",
          {
            headers: { Authorization: `Token ${token}` },
          },
        );
        const data = await res.json();
        if (res.ok) {
          setCustomers(data);
        }
      } catch (error) {
        showToast("خطا در دریافت لیست مشتریان", "red");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`آیا از حذف کامل مشتری "${name}" مطمئن هستید؟`)) return;
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://127.0.0.1:8000/api/loyalty/customers/${id}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        },
      );
      if (res.ok) {
        showToast(`مشتری ${name} با موفقیت حذف شد.`, "green");
        setCustomers(customers.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        showToast(data.error || "خطا در حذف مشتری", "red");
      }
    } catch (error) {
      showToast("خطا در ارتباط با سرور", "red");
    }
  };

  const openEditModal = (c: CustomerData) => {
    setEditingCustomer({
      id: c.id,
      name: c.user?.first_name || "",
      phone: c.phone_number,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingCustomer.name || !editingCustomer.phone) {
      showToast("نام و شماره موبایل نمی‌توانند خالی باشند.", "red");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://127.0.0.1:8000/api/loyalty/customers/${editingCustomer.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            name: editingCustomer.name,
            phone: editingCustomer.phone,
          }),
        },
      );

      const data = await res.json();
      if (res.ok) {
        showToast("تغییرات با موفقیت ذخیره شد.", "green");
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id
              ? {
                  ...c,
                  user: { ...c.user, first_name: editingCustomer.name },
                  phone_number: editingCustomer.phone,
                }
              : c,
          ),
        );
        setIsEditModalOpen(false);
      } else {
        showToast(data.error || "خطا در ذخیره تغییرات", "red");
      }
    } catch (error) {
      showToast("خطا در ارتباط با سرور", "red");
    } finally {
      setIsSaving(false);
    }
  };

  // --- تابع محاسبه زنده سطح از روی موجودی (دقیقاً مثل صفحه کیف پول) ---
  const calculateRealLevel = (balance: number) => {
    if (balance >= 5000000)
      return { name: "الماس", emoji: "💎", className: "lv-diamond" };
    if (balance >= 2000000)
      return { name: "طلایی", emoji: "🥇", className: "lv-gold" };
    if (balance >= 500000)
      return { name: "نقره‌ای", emoji: "🥈", className: "lv-silver" };
    return { name: "برنزی", emoji: "🥉", className: "lv-bronze" };
  };

  return (
    <div className="page active" style={{ position: "relative" }}>
      <div className="card-header" style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "20px", fontWeight: 900 }}>👥 لیست مشتریان</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-outline btn-sm">📥 نمونه</button>
          <Link href="/add-customer" className="btn btn-gold btn-sm">
            ➕ جدید
          </Link>
        </div>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="جستجو در مشتریان..." />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>مشتری</th>
                <th>سطح</th>
                <th>موجودی</th>
                <th>شبکه (معرف)</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "var(--gold)",
                    }}
                  >
                    در حال دریافت اطلاعات... ⏳
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty">
                      <div className="empty-icon">👥</div>
                      <div className="empty-text">مشتری‌ای ثبت نشده</div>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  // گرفتن اطلاعات سطح به صورت زنده از روی پول کاربر
                  const currentBalance = c.wallet?.balance || 0;
                  const realLevel = calculateRealLevel(currentBalance);

                  return (
                    <tr key={c.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div className="avatar">👤</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "14px" }}>
                              {c.user?.first_name || "بدون نام"}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--white3)",
                              }}
                            >
                              {c.phone_number}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`level-badge ${realLevel.className}`}>
                          {realLevel.emoji} {realLevel.name}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--gold)" }}>
                          {currentBalance.toLocaleString("fa-IR")}
                        </strong>
                        <span
                          style={{ fontSize: "11px", color: "var(--white3)" }}
                        >
                          {" "}
                          ت
                        </span>
                      </td>
                      <td>
                        <span style={{ color: "var(--white3)" }}>مستقیم</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            className="btn btn-gold btn-sm"
                            title="ویرایش"
                            onClick={() => openEditModal(c)}
                          >
                            ✏️
                          </button>
                          <Link
                            href="/charge"
                            className="btn btn-green btn-sm"
                            title="شارژ سریع"
                          >
                            ⚡
                          </Link>
                          <button
                            className="btn btn-outline btn-sm"
                            style={{
                              borderColor: "var(--red)",
                              color: "var(--red)",
                            }}
                            title="حذف"
                            onClick={() =>
                              handleDelete(
                                c.id,
                                c.user?.first_name || "بدون نام",
                              )
                            }
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(10, 10, 10, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="card"
            style={{
              width: "90%",
              maxWidth: "400px",
              border: "1px solid rgba(201,168,76,0.3)",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 900,
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>✏️ ویرایش مشتری</span>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--white3)",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ❌
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label>نام و نام خانوادگی</label>
              <input
                type="text"
                value={editingCustomer.name}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label>شماره موبایل</label>
              <input
                type="tel"
                value={editingCustomer.phone}
                onChange={(e) =>
                  setEditingCustomer({
                    ...editingCustomer,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-gold"
                style={{ flex: 1 }}
                onClick={handleUpdate}
                disabled={isSaving}
              >
                {isSaving ? "در حال ذخیره... ⏳" : "💾 ذخیره تغییرات"}
              </button>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={() => setIsEditModalOpen(false)}
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
