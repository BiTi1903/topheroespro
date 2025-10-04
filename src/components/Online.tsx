"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

const getToday = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

export default function StatsCounter() {
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const today = getToday();
    const todayRef = doc(db, "stats", today);
    const totalRef = doc(db, "stats", "total");

    // --- View Counter ---
    setDoc(todayRef, { views: increment(1) }, { merge: true });
    setDoc(totalRef, { views: increment(1) }, { merge: true });

    const unsubToday = onSnapshot(todayRef, (snap) => {
      if (snap.exists()) setTodayCount(snap.data().views || 0);
    });

    const unsubTotal = onSnapshot(totalRef, (snap) => {
      if (snap.exists()) setTotalCount(snap.data().views || 0);
    });

    // --- Online Counter ---
    const sessionId = Math.random().toString(36).substring(2, 15);
    const onlineRef = doc(db, "onlineUsers", sessionId);

    // Khi user vào -> tạo doc online
    setDoc(onlineRef, { timestamp: serverTimestamp() });

    // Khi user thoát -> xóa doc online
    const handleBeforeUnload = () => {
      deleteDoc(onlineRef);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Lắng nghe số online realtime
    const unsubOnline = onSnapshot(
      doc(db, "stats", "onlineCount"),
      (snap) => {
        if (snap.exists()) setOnlineCount(snap.data().count || 0);
      }
    );

    // Tự động tăng/giảm online count
    updateDoc(doc(db, "stats", "onlineCount"), { count: increment(1) }).catch(
      async () => {
        await setDoc(doc(db, "stats", "onlineCount"), { count: 1 });
      }
    );

    return () => {
      unsubToday();
      unsubTotal();
      unsubOnline();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      deleteDoc(onlineRef);
      updateDoc(doc(db, "stats", "onlineCount"), {
        count: increment(-1),
      }).catch(() => {});
    };
  }, []);

  return (
    <div className="p-4 rounded-lg bg-gray-900 border border-purple-500/20 text-white">
      <h2 className="text-lg font-semibold mb-2">📊 Thống kê</h2>
      <p>👀 Đang online: <span className="font-bold">{onlineCount}</span></p>
      <p>🔥 Hôm nay: <span className="font-bold">{todayCount}</span></p>
      <p>🌍 Tổng cộng: <span className="font-bold">{totalCount}</span></p>
    </div>
  );
}
