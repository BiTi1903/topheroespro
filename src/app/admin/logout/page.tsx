// app/admin/logout/page.tsx
"use client";

import { useEffect } from "react";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);
        // Xóa toàn bộ cache
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect về trang login
        router.push("/admin");
      } catch (error) {
        console.error("Logout error:", error);
        router.push("/admin");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Đang đăng xuất...</p>
      </div>
    </div>
  );
}