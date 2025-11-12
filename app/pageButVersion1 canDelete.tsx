"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ ถ้ายังไม่ล็อกอิน → redirect ไปหน้า /login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // ✅ โหลดข้อมูลจาก backend (เฉพาะถ้าล็อกอินแล้ว)
  useEffect(() => {
    if (status === "authenticated") {
      fetch("http://localhost:3001/user")
        .then((res) => {
          if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
          return res.json();
        })
        .then((data) => setUsers(data))
        .catch(() => setError("เชื่อมต่อไม่ได้"))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center">
        <p>กำลังตรวจสอบ session...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">User List</h1>

      {/* ✅ ปุ่ม Login / Logout */}
      {session ? (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-gray-700">
            สวัสดี, {session.user?.name || "ผู้ใช้"}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
          >
            ออกจากระบบ
          </button>
        </div>
      ) : null}

      {/* ✅ ตารางข้อมูล */}
      {loading && <p>กำลังโหลดข้อมูล...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full border border-gray-300 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Password</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
