"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("สมัครสมาชิกสำเร็จ! 🎉");
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(data.message || "เกิดข้อผิดพลาดในการสมัคร");
      }
    } catch (err) {
      setMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm border border-green-100"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          สมัครสมาชิก
        </h1>
        <p className="text-center text-sm text-green-600 mb-6">
          สร้างบัญชีของคุณกับ{" "}
          <span className="font-semibold">Green Hub Shop</span> 🌿
        </p>

        {/* ชื่อผู้ใช้ */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            ชื่อผู้ใช้
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="เช่น Green"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* อีเมล */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            อีเมล
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* รหัสผ่าน */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-green-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* ข้อความสถานะ */}
        {message && (
          <p className="text-center text-sm mb-4 text-green-700">{message}</p>
        )}

        {/* ปุ่มสมัคร */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-medium py-2.5 rounded-lg transition duration-200 ${
            loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        {/* ปุ่มไปหน้า login */}
        <div className="mt-5 text-center">
          <p className="text-sm text-green-700">
            มีบัญชีอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              กลับไปเข้าสู่ระบบ
            </Link>
          </p>
        </div>

        {/* ปุ่มกลับหน้าหลัก */}
        <div className="mt-3 text-center">
          <Link
            href="/"
            className="inline-block text-green-700 font-medium hover:underline"
          >
            ⬅️ กลับหน้าหลัก
          </Link>
        </div>
      </form>
    </div>
  );
}
