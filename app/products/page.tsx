"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3001/products", { cache: "no-store" });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("โหลดสินค้าล้มเหลว:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-6">
        <div className="rounded-3xl bg-white/60 backdrop-blur border border-green-100 shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <p className="text-sm tracking-widest text-green-700/70 font-semibold">ECO MARKET</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold leading-tight text-green-900">
              เลือกของดีต่อโลก <span className="text-green-600">ดีต่อคุณ</span>
            </h1>
            <p className="mt-4 text-green-700/90">
              คัดสรรสินค้ารักษ์โลก คุณภาพดี ราคาดีไซน์สวย ใช้ได้นาน —
              ช่วยลดขยะและคาร์บอนในทุกวันของคุณ
            </p>
          </div>
          <div className="w-full md:w-80">
            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-500 p-1 shadow-xl">
              <div className="rounded-3xl bg-white p-6 text-center">
                <div className="text-3xl font-extrabold text-green-700">
                  {loading ? "…" : products.length}
                </div>
                <div className="text-green-700/80">รายการสินค้า</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        {loading ? (
          // Skeleton Loading
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-green-100 bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-64 w-full bg-green-100/40" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-green-100/60 rounded" />
                  <div className="h-4 w-full bg-green-100/60 rounded" />
                  <div className="h-4 w-5/6 bg-green-100/60 rounded" />
                  <div className="h-6 w-28 bg-green-200/60 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                href={`/products/${p.id}`}
                key={p.id}
                className="group relative rounded-2xl border border-green-100 bg-white shadow-sm hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* top badge */}
                <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700 shadow">
                  ECO
                </span>

                {/* image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* content */}
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-green-900 leading-snug h-12 overflow-hidden text-ellipsis line-clamp-2">
                    {p.name}
                  </h2>
                  <p className="mt-2 text-sm text-green-700/80 h-12 overflow-hidden text-ellipsis line-clamp-2">
                    {p.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xl font-bold text-green-700 whitespace-nowrap">
                      ฿{Number(p.price).toLocaleString()}
                    </div>
                    <div className="inline-flex items-center gap-1 text-green-700 group-hover:text-green-800">
                      <span className="text-sm font-medium">ดูรายละเอียด</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* gradient border on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-green-300/70" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
