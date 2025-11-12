"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // ❗ ป้องกัน redirect อัตโนมัติ
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      window.location.href = "/"; // ✅ ไปหน้าหลังล็อกอิน
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          เข้าสู่ระบบ
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            อีเมล
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-600 transition duration-200"
        >
          เข้าสู่ระบบ
        </button>

        {/* ✅ ปุ่มสมัครสมาชิก */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <a
              href="/register"
              className="text-indigo-500 font-medium hover:underline"
            >
              สมัครสมาชิก
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
