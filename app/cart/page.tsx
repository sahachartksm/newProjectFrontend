"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCart,
  updateQty,
  removeItem,
  clearCart,
  CartItem,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = () => {
      const data = getCart();
      setItems(data);
      setLoading(false);
    };
    loadCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  function onQtyChange(id: number, v: number) {
    updateQty(id, v);
    setItems(getCart());
  }

  function onRemove(id: number) {
    removeItem(id);
    setItems(getCart());
  }

  function onClear() {
    clearCart();
    setItems([]);
  }

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-green-700">
        กำลังโหลดตะกร้า...
      </main>
    );

  return (
    <main className="min-h-screen bg-green-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">
          ตะกร้าสินค้า
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-green-700 mb-6">ตะกร้าของคุณยังว่างอยู่</p>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-6">
            {/* รายการสินค้า */}
            <section className="bg-white rounded-2xl shadow p-4 md:p-6 space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-4 items-center border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800">{it.name}</h3>
                    <p className="text-green-700">
                      ฿{it.price.toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm text-green-700">จำนวน</label>
                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) =>
                          onQtyChange(
                            it.id,
                            Math.max(1, Number(e.target.value))
                          )
                        }
                        className="w-20 rounded border border-green-300 px-3 py-1 focus:outline-none"
                      />
                      <button
                        onClick={() => onRemove(it.id)}
                        className="text-red-600 hover:underline ml-2"
                      >
                        ลบออก
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-green-800">
                    ฿{(it.price * it.qty).toLocaleString()}
                  </div>
                </div>
              ))}
            </section>

            {/* สรุปยอด */}
            <aside className="bg-white rounded-2xl shadow p-6 h-fit">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                สรุปคำสั่งซื้อ
              </h2>
              <div className="flex justify-between text-green-700 mb-2">
                <span>ยอดรวม</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-green-900 text-lg border-t pt-3">
                <span>ชำระทั้งหมด</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>

              <button
                className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                onClick={() => (window.location.href = "/checkout")}
              >
                ชำระเงิน
              </button>

              <button
                className="w-full mt-3 border border-green-600 text-green-700 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition"
                onClick={onClear}
              >
                ล้างตะกร้า
              </button>

              <Link
                href="/products"
                className="block text-center mt-4 text-green-700 hover:underline"
              >
                ← เลือกซื้อสินค้าต่อ
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
