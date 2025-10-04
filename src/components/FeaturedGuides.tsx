"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye } from "lucide-react";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase";

interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  views: number;
  category: string;
  description: string;
    pinned?: boolean; // thêm dòng này

}

export default function FeaturedGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showAll, setShowAll] = useState(false);

 useEffect(() => {
  const fetchGuides = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "guides"));
      const guidesData: Guide[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: Number(doc.data().views || 0),
        pinned: doc.data().pinned || false, // thêm pinned
      } as Guide));

      // Sắp xếp: pinned lên đầu
      guidesData.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      // hoặc đơn giản: guidesData.sort((a,b)=> Number(b.pinned) - Number(a.pinned));

      setGuides(guidesData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bài viết:", error);
    }
  };

  fetchGuides();
}, []);


  const handleClick = async (id: string) => {
    try {
      const guideRef = doc(db, "guides", id);
      await updateDoc(guideRef, { views: increment(1) });

      setGuides(prev =>
        prev.map(g => (g.id === id ? { ...g, views: g.views + 1 } : g))
      );
    } catch (error) {
      console.error("Lỗi khi tăng lượt xem:", error);
    }
  };

  // Số bài hiển thị ban đầu
  const displayedGuides = showAll ? guides : guides.slice(0, 6);

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <button
  className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
  onClick={() => {
    setShowAll(!showAll);
    // Cuộn xuống danh sách
    setTimeout(() => {
      const el = document.getElementById("featured-guides-list");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }}
>
  <span>{showAll ? "Thu gọn" : "Xem tất cả"}</span>
  <ChevronRight
    className={`w-4 h-4 transition-transform ${showAll ? "rotate-90" : "rotate-0"}`}
  />
</button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedGuides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.id}`}
            onClick={() => handleClick(guide.id)}
          >
            <div className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer flex flex-col h-full">
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="text-sm text-purple-400 mb-2">{guide.game}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                  {guide.title}
                </h3>
                <p className="text-purple-200 mb-4 line-clamp-3">
                  {guide.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-purple-300 mt-auto">
                  <div className="relative flex items-center space-x-1 group cursor-pointer">
                    <Eye className="w-4 h-4 transition-colors duration-200 group-hover:text-white" />
                    <span className="transition-colors duration-200 group-hover:text-white">
                      {guide.views}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
