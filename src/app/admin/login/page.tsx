'use client';
import { useState } from "react";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch {
      setError("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
      <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-md border border-purple-500/20 p-8 rounded-2xl space-y-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
          <p className="text-purple-300 mt-2">Đăng nhập để quản lý bài viết</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg text-sm">{error}</div>}

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition" />
        <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800/50 border border-purple-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition" />
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition shadow-lg shadow-purple-500/30">Đăng nhập</button>
      </form>
    </div>
  );
}
