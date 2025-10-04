"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";

interface Guide {
  id: string;
  title: string;
  game?: string;
  content?: string;
  createdAt?: any; // timestamp Firebase
  views?: number;  // số lượt xem
}

function timeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime(); // milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

export default function RecentGuides() {
  const [recentGuides, setRecentGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchRecentGuides = async () => {
      try {
        const q = query(
          collection(db, "guides"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const guides: Guide[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          guides.push({
            id: docSnap.id,
            views: Number(data.views || 0), // đảm bảo number
            ...data,
          } as Guide);
        });
        setRecentGuides(guides);
      } catch (error) {
        console.error("Lỗi khi lấy bài mới:", error);
      }
    };

    fetchRecentGuides();
  }, []);

  const handleClick = async (id: string) => {
    try {
      const guideRef = doc(db, "guides", id);
      await updateDoc(guideRef, { views: increment(1) });

      // Cập nhật local state để tăng lượt xem ngay lập tức
      setRecentGuides(prev =>
        prev.map(g => (g.id === id ? { ...g, views: (g.views || 0) + 1 } : g))
      );
    } catch (error) {
      console.error("Lỗi khi tăng lượt xem:", error);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>Mới cập nhật</span>
      </h3>
      <div className="space-y-4">
        {recentGuides.map((guide) => {
          const createdAt = guide.createdAt
            ? new Date(guide.createdAt.seconds * 1000)
            : null;
          const snippet = guide.game
            ? guide.game
            : guide.content
            ? guide.content.slice(0, 30) + (guide.content.length > 30 ? "..." : "")
            : "...";

          return (
            <Link
              key={guide.id}
              href={`/guides/${guide.id}`}
              onClick={() => handleClick(guide.id)}
              className="block pb-4 border-b border-purple-500/20 last:border-0 hover:bg-white/5 p-2 rounded-lg transition"
            >
              <h4 className="text-white font-medium mb-1 hover:text-purple-400 transition">
                {guide.title}
              </h4>
              <div className="flex items-center justify-between text-sm text-purple-300">
                <span>{snippet}</span>
                <span>{createdAt ? timeAgo(createdAt) : "..."}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
