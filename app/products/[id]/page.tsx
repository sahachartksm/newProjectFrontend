"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number; // 0–5
  reviews?: number; // count
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [recommend, setRecommend] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // scroll container for carousel
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const scrollByItem = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth =
      el.firstElementChild instanceof HTMLElement
        ? el.firstElementChild.offsetWidth
        : 320;
    el.scrollBy({
      left: (dir === "left" ? -1 : 1) * (cardWidth + 24),
      behavior: "smooth",
    });
  };

  // scroll to top when id changes
  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      1
    );
    alert("✅ เพิ่มลงตะกร้าแล้ว!");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:3001/products/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("ไม่พบสินค้า");
        const data = (await res.json()) as Product;
        // fallback rating
        if (data.rating == null) data.rating = 4.6;
        if (data.reviews == null) data.reviews = 128;
        setProduct(data);

        const resAll = await fetch("http://localhost:3001/products", {
          cache: "no-store",
        });

        const allProducts = (await resAll.json()) as Product[];
        setRecommend(
          allProducts
            .filter((p) => p.id !== Number(id))
            .map((p) => ({
              ...p,
              rating: p.rating ?? 4.5,
              reviews: p.reviews ?? 60,
            }))
        );
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const Stars = ({ rating = 0 }: { rating?: number }) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <div className="flex items-center gap-1 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => {
          const state =
            i < full ? "full" : i === full && half ? "half" : "empty";
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current">
              {state === "half" ? (
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              ) : null}
              <path
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.98 4.8 17.5l1-5.78-4.22-4.1 5.83-.85L10 1.5z"
                fill={
                  state === "full"
                    ? "currentColor"
                    : state === "half"
                    ? `url(#half-${i})`
                    : "none"
                }
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-green-700 text-xl">
        กำลังโหลดสินค้า...
      </main>
    );

  if (!product)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-green-700">
        <p>ไม่พบสินค้าที่คุณค้นหา 😢</p>
        <Link
          href="/products"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          กลับไปหน้าสินค้า
        </Link>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 flex flex-col items-center">
      {/* ======= Product hero section (หน้าหลักใหญ่) ======= */}
      <section className="w-full flex justify-center p-6 md:p-10">
        <div className="max-w-6xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* image */}
          <div className="relative w-full h-[420px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover rounded-xl shadow-md"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* content */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 leading-tight">
              {product.name}
            </h1>

            {/* rating */}
            <div className="flex items-center gap-2">
              <Stars rating={product.rating} />
              <span className="text-sm text-green-700">
                {product.rating?.toFixed(1)} • {product.reviews} รีวิว
              </span>
            </div>

            <p className="text-green-700 leading-relaxed">
              {product.description}
            </p>

            <p className="text-3xl font-semibold text-green-600 whitespace-nowrap">
              ฿{product.price.toLocaleString()}
            </p>

            <div className="flex gap-4 pt-2">
              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg whitespace-nowrap min-w-[180px]"
              >
                เพิ่มลงตะกร้า
              </button>
              <Link
                href="/products"
                className="border border-green-600 text-green-700 px-8 py-3 rounded-lg hover:bg-green-600 hover:text-white transition text-lg whitespace-nowrap min-w-[200px] text-center"
              >
                ← กลับไปหน้าสินค้า
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======= Recommendation carousel (ด้านล่างสุด เลื่อนซ้ายขวา) ======= */}
      {recommend.length > 0 && (
        <section className="w-full flex justify-center pb-12 px-6 md:px-10">
          <div className="max-w-6xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-green-800">
                🌿 สินค้าแนะนำ
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollByItem("left")}
                  className="h-10 w-10 rounded-full border border-green-300 text-green-700 hover:bg-green-100"
                  aria-label="เลื่อนไปซ้าย"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollByItem("right")}
                  className="h-10 w-10 rounded-full border border-green-300 text-green-700 hover:bg-green-100"
                  aria-label="เลื่อนไปขวา"
                >
                  ›
                </button>
              </div>
            </div>

            <div
              ref={sliderRef}
              className="relative flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{ scrollbarWidth: "none" }}
            >
              {recommend.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  prefetch={false}
                  className="snap-start bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex-shrink-0 w-[280px]"
                >
                  <div className="relative w-full h-44">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-green-800 text-sm h-10 leading-5 line-clamp-2 overflow-hidden">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars rating={p.rating} />
                      <span className="text-xs text-green-700">
                        {p.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-green-600 font-semibold mt-2 whitespace-nowrap">
                      ฿{p.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
