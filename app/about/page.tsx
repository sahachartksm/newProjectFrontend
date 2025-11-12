// app/about/page.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center space-y-6"
      >
        <h1 className="text-4xl font-bold text-green-700">Green Hub Shop</h1>
        <p className="text-lg leading-relaxed">
          <span className="font-semibold text-green-800">Green Hub Shop</span>{" "}
          เป็นแพลตฟอร์มร้านค้าขายของออนไลน์ที่เน้นความเรียบง่ายและเป็นมิตรกับสิ่งแวดล้อม
          ออกแบบมาเพื่อช่วยให้ผู้ประกอบการสามารถสร้างร้านค้าของตัวเองได้อย่างง่ายดาย
          พร้อมบรรยากาศโทนสีเขียวที่ให้ความรู้สึกสดชื่นและน่าเชื่อถือ
        </p>
        <p>
          เว็บไซต์นี้พัฒนาด้วย <strong>Next.js</strong> และ{" "}
          <strong>Tailwind CSS</strong> เพื่อความรวดเร็ว สวยงาม
          และใช้งานได้ดีทั้งบนคอมพิวเตอร์และมือถือ
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
