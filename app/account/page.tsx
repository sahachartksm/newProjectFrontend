"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserCrudPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3001/user";

  // ✅ โหลดข้อมูล
  async function loadUsers() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  // ✅ สร้างหรืออัปเดตผู้ใช้
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || (!editingUser && !form.password)) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const body = {
      name: form.name,
      email: form.email,
      password: form.password || "1234",
    };

    if (editingUser) {
      const confirmEdit = confirm(
        `คุณต้องการแก้ไข ${editingUser.name} หรือไม่?`
      );
      if (!confirmEdit) return;

      await fetch(`${API_URL}/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setForm({ name: "", email: "", password: "" });
    setEditingUser(null);
    loadUsers();
  }

  // ✅ ลบผู้ใช้
  async function handleDelete(id: number, name: string) {
    const confirmDelete = confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${name}" ?`);
    if (!confirmDelete) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadUsers();
  }

  // ✅ เตรียมแก้ไข
  function handleEdit(user: User) {
    const confirmEdit = confirm(
      `คุณต้องการแก้ไขข้อมูลของ "${user.name}" หรือไม่?`
    );
    if (!confirmEdit) return;
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "" });
  }

  // ✅ ฟิลเตอร์ผู้ใช้
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-green-700 text-xl">
        กำลังโหลดข้อมูล...
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
          🧑‍💼 จัดการผู้ใช้ (User Management)
        </h1>

        {/* 🔍 ช่องค้นหา */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่อหรืออีเมล..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-green-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
          />
        </div>

        {/* 🟢 ฟอร์มเพิ่ม / แก้ไข */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2 w-full md:w-1/3"
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border border-green-300 rounded-lg px-4 py-2 w-full md:w-1/3"
          />
          {!editingUser && (
            <input
              type="password"
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-green-300 rounded-lg px-4 py-2 w-full md:w-1/3"
            />
          )}
          <button
            type="submit"
            disabled={
              !form.name || !form.email || (!editingUser && !form.password)
            }
            className={`px-6 py-2 rounded-lg text-white transition ${
              !form.name || !form.email || (!editingUser && !form.password)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingUser ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}
          </button>
        </form>

        {/* 🧾 ตารางผู้ใช้ */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-green-200 rounded-xl text-sm">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">ชื่อ</th>
                <th className="px-4 py-3 border">อีเมล</th>
                <th className="px-4 py-3 border text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    ไม่พบข้อมูลผู้ใช้
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
