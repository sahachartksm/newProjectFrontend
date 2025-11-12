"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-[9999] bg-white/80 backdrop-blur-sm shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* โลโก้ */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://greenhub.co.th/themes/greenhub/assets/images/logo/greenhub-brand-logo.png"
            alt="Green Hub Logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-2xl font-bold text-green-700 hover:text-green-800 transition">
            Green Hub Shop
          </span>
        </Link>

        {/* เมนูหลัก (Desktop) */}
        <div className="hidden md:flex gap-6 text-green-700 font-medium items-center">
          <Link href="/">หน้าแรก</Link>
          <Link href="/products">สินค้า</Link>
          <Link href="/about">เกี่ยวกับเรา</Link>

          {/* ตะกร้า */}
          <Link
            href="/cart"
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition"
          >
            <ShoppingCart size={18} />
            <span>ตะกร้า</span>
          </Link>

          {/* ยังไม่ล็อกอิน */}
          {!session && (
            <Link
              href="/login"
              className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
            >
              เข้าสู่ระบบ
            </Link>
          )}

          {/* ล็อกอินแล้ว */}
          {session && (
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="ml-2 text-green-700 hover:text-green-800 transition"
              aria-label="toggle submenu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* ปุ่มเมนู (Mobile) */}
        <div className="md:hidden flex items-center gap-3">
          <Link href="/cart" aria-label="cart">
            <ShoppingCart
              size={26}
              className="text-green-700 hover:text-green-800 transition"
            />
          </Link>
          {session && (
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="text-green-700 hover:text-green-800 transition"
              aria-label="toggle mobile menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* เมนูย่อย (Dropdown) - ใช้ fixed + z สูง */}
      <AnimatePresence>
        {isMenuOpen && session && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed right-6 top-16 z-[10000] w-56 rounded-xl bg-white border border-green-100 shadow-md overflow-hidden"
          >
            <div className="flex flex-col items-center gap-4 py-4 text-green-800 font-medium">
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-green-700"
              >
                👤 จัดการผู้ใช้
              </Link>

              <Link
                href="/products/manage"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-green-700"
              >
                🛍️ จัดการสินค้า
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                ออกจากระบบ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
