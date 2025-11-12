"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      window.location.href = "/"; // ✅ กลับหน้า Home หลังล็อกอิน
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-lime-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm border border-green-100"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
          เข้าสู่ระบบ
        </h1>
        <p className="text-center text-sm text-green-600 mb-6">
          ยินดีต้อนรับสู่ <span className="font-semibold">Green Hub Shop</span>{" "}
          🌿
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            อีเมล
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-green-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition duration-200"
        >
          เข้าสู่ระบบ
        </button>

        {/* Sign up */}
        <div className="mt-5 text-center">
          <p className="text-sm text-green-700">
            ยังไม่มีบัญชีใช่ไหม?{" "}
            <Link
              href="/register"
              className="text-green-600 font-semibold hover:underline"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
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
