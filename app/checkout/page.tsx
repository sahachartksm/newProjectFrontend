"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCart, clearCart, CartItem } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();

  // ✅ แก้จาก useState(getCart()) → โหลดใน useEffect แทน
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);

  // ✅ โหลดตะกร้าหลังจาก mount (ฝั่ง client)
  useEffect(() => {
    const loadCart = () => {
      const data = getCart();
      setCart(data);
      setLoadingCart(false);
    };
    loadCart();
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // จำลองการส่งข้อมูลไป backend
    await new Promise((r) => setTimeout(r, 1200));

    clearCart();
    setLoading(false);
    alert("✅ สั่งซื้อสำเร็จ! ขอบคุณสำหรับการสั่งซื้อของคุณ 💚");
    router.push("/");
  }

  // ✅ ระหว่างโหลดตะกร้า
  if (loadingCart)
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50 text-green-700">
        กำลังโหลดตะกร้าสินค้า...
      </main>
    );

  if (cart.length === 0)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-700">
        <p>ไม่มีสินค้าในตะกร้า 😅</p>
        <Link
          href="/products"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          กลับไปเลือกสินค้า
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
          🧾 ชำระเงิน / Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔹 ข้อมูลจัดส่ง */}
          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              ที่อยู่สำหรับจัดส่ง
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-green-700 mb-1">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-green-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-green-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-green-700 mb-1">ที่อยู่จัดส่ง</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-green-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-green-400"
              ></textarea>
            </div>
          </section>

          {/* 🔹 วิธีการชำระเงิน */}
          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              วิธีการชำระเงิน
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-green-800">
                <input
                  type="radio"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                />
                ชำระเงินปลายทาง (COD)
              </label>
              <label className="flex items-center gap-2 text-green-800">
                <input
                  type="radio"
                  value="bank"
                  checked={payment === "bank"}
                  onChange={() => setPayment("bank")}
                />
                โอนผ่านบัญชีธนาคาร
              </label>
              <label className="flex items-center gap-2 text-green-800">
                <input
                  type="radio"
                  value="credit"
                  checked={payment === "credit"}
                  onChange={() => setPayment("credit")}
                />
                ชำระด้วยบัตรเครดิต / เดบิต
              </label>
            </div>
          </section>

          {/* 🔹 สรุปรายการ */}
          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              สรุปรายการสินค้า
            </h2>
            <ul className="divide-y divide-green-100 mb-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-2 text-green-800"
                >
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>฿{(item.price * item.qty).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold text-lg text-green-900 border-t border-green-200 pt-3">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{total.toLocaleString()}</span>
            </div>
          </section>

          {/* 🔹 ปุ่มชำระเงิน */}
          <div className="flex justify-end gap-4 pt-4 border-t border-green-100">
            <Link
              href="/cart"
              className="border border-green-600 text-green-700 px-6 py-2 rounded-lg hover:bg-green-600 hover:text-white transition"
            >
              ← กลับไปตะกร้า
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-70"
            >
              {loading ? "กำลังดำเนินการ..." : "ยืนยันการสั่งซื้อ"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
