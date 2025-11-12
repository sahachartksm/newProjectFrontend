"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string; // จาก DB เป็น string
  stock: number;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export default function HomePage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3001/products", {
          cache: "no-store",
        });
        const data: Product[] = await res.json();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ แนะนำ “ของจริง” ล่าสุดจาก DB (อัปเดตล่าสุด 3 ชิ้น)
  const recommended = useMemo(
    () =>
      [...products]
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .slice(0, 3),
    [products]
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-14 md:pt-20">
        <div className="rounded-3xl border border-emerald-100/70 bg-white/70 backdrop-blur-xl shadow-xl ring-1 ring-white/60">
          <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:p-12">
            {/* text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-6"
            >
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700">
                🌱 Eco-first marketplace
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-emerald-950 md:text-5xl">
                เลือกของที่{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ดีต่อโลก ดีต่อคุณ
                </span>
              </h1>
              <p className="text-emerald-800/90">
                สินค้ารักษ์โลกคุณภาพสูง คัดสรรจากผู้ผลิตที่ใส่ใจสิ่งแวดล้อม
                ลดพลาสติก ใช้ได้นาน และสวยแบบมีสไตล์
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="rounded-xl bg-emerald-600 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                >
                  ดูสินค้า
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl border border-emerald-600 px-8 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                >
                  สมัครสมาชิก
                </Link>
              </div>

              {session?.user && (
                <p className="mt-2 text-sm text-emerald-900">
                  สวัสดี,{" "}
                  <span className="font-semibold">{session.user.name}</span> 👋
                </p>
              )}
            </motion.div>

            {/* image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-80 w-80 overflow-hidden rounded-3xl ring-4 ring-white/70 shadow-2xl md:h-[420px] md:w-[420px]">
                <Image
                  src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1600&q=80"
                  alt="eco shopping"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="relative z-10 mx-auto mt-12 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: "🚚", text: "ส่งฟรีเมื่อครบ 799 ฿" },
            { icon: "🔁", text: "คืนสินค้าได้ภายใน 30 วัน" },
            { icon: "🌳", text: "ปลูกต้นไม้ 1 ต้นต่อออเดอร์" },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/70 p-4 shadow-sm"
            >
              <span className="text-xl">{f.icon}</span>
              <p className="font-medium text-emerald-900">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED (REAL DATA) */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-3xl font-bold text-emerald-950">
            🌿 สินค้าแนะนำจากคลังจริง
          </h3>
          <Link
            href="/products"
            className="text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
          >
            ดูทั้งหมด
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-emerald-100 bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-emerald-100/40" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-emerald-100/60 rounded" />
                  <div className="h-4 w-full bg-emerald-100/60 rounded" />
                  <div className="h-6 w-28 bg-emerald-200/60 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <Link
                href={`/products/${p.id}`}
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                    ล่าสุด
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="line-clamp-2 h-12 text-lg font-semibold text-emerald-950">
                    {p.name}
                  </h4>
                  <p className="mt-1 line-clamp-2 h-12 text-sm text-emerald-800/90">
                    {p.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-emerald-700">
                      ฿{Number(p.price).toLocaleString()}
                    </p>
                    <span className="rounded-lg border border-emerald-600 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      ดูรายละเอียด
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-4 bg-emerald-800/95 py-6 text-center text-sm text-emerald-50">
        © 2025 Green Hub Shop — สินค้ารักษ์โลกเพื่ออนาคตที่ยั่งยืน 🌱
      </footer>
    </main>
  );
}
