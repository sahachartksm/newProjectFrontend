"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
}

export default function ProductCrudPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({});
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001/products";

  // ✅ โหลดข้อมูลสินค้า
  async function loadProducts() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("โหลดสินค้าไม่สำเร็จ:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ เพิ่มหรือแก้ไขสินค้า
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      alert("กรุณากรอกชื่อและราคาสินค้า");
      return;
    }

    const body = {
      name: form.name,
      description: form.description || "",
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      image: form.image || "",
      category: form.category || "",
    };

    if (editing) {
      const confirmEdit = confirm(`แก้ไขสินค้า "${editing.name}" ใช่ไหม?`);
      if (!confirmEdit) return;

      await fetch(`${API_URL}/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setForm({});
    setEditing(null);
    loadProducts();
  }

  // ✅ ลบสินค้า
  async function handleDelete(id: number, name: string) {
    const confirmDel = confirm(`ต้องการลบ "${name}" ใช่ไหม?`);
    if (!confirmDel) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadProducts();
  }

  // ✅ เตรียมแก้ไขสินค้า
  function handleEdit(product: Product) {
    setEditing(product);
    setForm(product);
  }

  // ✅ ฟิลเตอร์ค้นหา
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <main className="flex justify-center items-center h-screen text-green-700 text-xl">
        กำลังโหลดสินค้า...
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          🛍️ จัดการสินค้า (Product Management)
        </h1>

        {/* 🔍 ช่องค้นหา */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-green-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
          />
        </div>

        {/* 🟢 ฟอร์มเพิ่ม / แก้ไข */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="ชื่อสินค้า"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="ราคา"
            value={form.price || ""}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            className="border border-green-300 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="จำนวนคงเหลือ"
            value={form.stock || ""}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
            className="border border-green-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="หมวดหมู่"
            value={form.category || ""}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="ลิงก์รูปภาพ"
            value={form.image || ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2"
          />
          <textarea
            placeholder="รายละเอียดสินค้า"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2 md:col-span-2"
          />
          <button
            type="submit"
            disabled={!form.name || !form.price}
            className={`px-6 py-2 rounded-lg text-white transition ${
              !form.name || !form.price
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
        </form>

        {/* 🧾 ตารางสินค้า */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-200 rounded-xl text-sm">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">รูป</th>
                <th className="px-4 py-3 border">ชื่อสินค้า</th>
                <th className="px-4 py-3 border">ราคา</th>
                <th className="px-4 py-3 border">จำนวน</th>
                <th className="px-4 py-3 border">หมวดหมู่</th>
                <th className="px-4 py-3 border text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-2 border">{p.id}</td>
                  <td className="px-4 py-2 border">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={60}
                        height={60}
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">ไม่มีรูป</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border">{p.name}</td>
                  <td className="px-4 py-2 border">฿{p.price}</td>
                  <td className="px-4 py-2 border">{p.stock}</td>
                  <td className="px-4 py-2 border">{p.category || "-"}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    ไม่พบสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
