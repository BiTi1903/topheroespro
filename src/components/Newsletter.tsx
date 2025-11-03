"use client";

import { useState } from "react";
import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async () => {
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }
    try {
      setStatus("loading");
      await addDoc(collection(db, "subscribers"), {
        email,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-2">Đăng ký nhận tin</h3>
      <p className="text-purple-200 text-sm mb-4">
        Nhận thông báo về hướng dẫn mới và tips độc quyền
      </p>

      <input
        type="email"
        placeholder="Email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-white/10 border border-purple-500/30 rounded-lg px-4 py-2 text-white placeholder-purple-300 outline-none focus:border-purple-500 mb-3"
      />

      <button
        onClick={handleSubscribe}
        disabled={status === "loading"}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
      >
        {status === "loading"
          ? "Đang đăng ký..."
          : status === "success"
          ? "✅ Đã đăng ký!"
          : "Đăng ký"}
      </button>

      {status === "error" && (
        <p className="text-red-400 text-sm mt-2">Lỗi! Hãy thử lại.</p>
      )}
    </div>
  );
}
