"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, ArrowUpDown } from "lucide-react";
import { collection, getDocs, doc, updateDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";

interface Guide {
  id: string;
  title: string;
  game?: string;
  image: string;
  views?: number;
  category?: string;
  description: string;
  pinned?: boolean;
  createdAt?: Date;
}

interface FeaturedGuidesProps {
  activeCategory?: string;
}

type SortOption = "featured" | "newest" | "views";

export default function FeaturedGuides({ activeCategory = "all" }: FeaturedGuidesProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const guidesData: Guide[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as {
            title: string;
            game?: string;
            image: string;
            views?: number;
            category?: string;
            description: string;
            pinned?: boolean;
            createdAt?: Timestamp;
          };
          return {
            id: doc.id,
            title: data.title,
            game: data.game,
            image: data.image,
            views: Number(data.views || 0),
            category: data.category,
            description: data.description,
            pinned: data.pinned || false,
            createdAt: data.createdAt?.toDate(),
          };
        });

        setGuides(guidesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };
    fetchGuides();
  }, []);

  // Reset về "Nổi bật" khi đổi category
  useEffect(() => {
    setSortBy("featured");
  }, [activeCategory]);

  const handleClick = async (id: string) => {
    try {
      const guideRef = doc(db, "guides", id);
      await updateDoc(guideRef, { views: increment(1) });
      setGuides(prev =>
        prev.map(g => (g.id === id ? { ...g, views: (g.views || 0) + 1 } : g))
      );
    } catch (error) {
      console.error("Lỗi khi tăng lượt xem:", error);
    }
  };

  const getSortedGuides = (guidesToSort: Guide[]) => {
    const sorted = [...guidesToSort];
    
    switch (sortBy) {
      case "featured":
        // Nổi bật: Pinned lên đầu, sau đó theo thời gian mới nhất
        sorted.sort((a, b) => {
          if (a.pinned !== b.pinned) {
            return Number(b.pinned) - Number(a.pinned);
          }
          if (a.createdAt && b.createdAt) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return 0;
        });
        break;
      case "newest":
        // Mới nhất trước
        sorted.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          return 0;
        });
        break;
      case "views":
        // Sắp xếp theo lượt xem cao nhất
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
    
    return sorted;
  };

  const filteredGuides = guides.filter(guide => {
    if (activeCategory === "all") return true;
    return guide.category === activeCategory;
  });

  const sortedGuides = getSortedGuides(filteredGuides);
  const displayedGuides = showAll ? sortedGuides : sortedGuides.slice(0, 6);

  if (filteredGuides.length === 0) {
    return (
      <div className="lg:col-span-2 space-y-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {activeCategory === "all" ? "Chưa có bài viết nào" : "Không có bài viết trong danh mục này"}
          </h3>
          <p className="text-gray-500">
            {activeCategory === "all"
              ? "Hãy thêm bài viết đầu tiên từ admin panel"
              : `Chưa có bài viết nào trong danh mục "${activeCategory}"`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        {/* Nút sắp xếp */}
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-purple-400" />
          <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value as SortOption)}
  className="
    bg-purple-500/10 border border-purple-400/30 text-purple-200
    rounded-lg px-3 py-2 text-sm transition-all duration-200
    cursor-pointer appearance-none outline-none
    hover:bg-purple-500/20 hover:border-purple-400
    focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400
  "
  style={{
    backgroundImage:
      "linear-gradient(to bottom right, rgba(147, 51, 234, 0.15), rgba(0,0,0,0.15))",
  }}
>

  <option value="newest" className="bg-[#1a0b2e] text-purple-100">
    Mới nhất
  </option>
  <option value="views" className="bg-[#1a0b2e] text-purple-100">
    Nhiều lượt xem
  </option>
</select>

        </div>

        {/* Nút xem tất cả */}
        <button
          className="text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
          onClick={() => {
            setShowAll(!showAll);
            setTimeout(() => {
              const el = document.getElementById("featured-guides-list");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }}
        >
          <span>{showAll ? "Thu gọn" : "Xem tất cả"}</span>
          <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? "rotate-90" : "rotate-0"}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="featured-guides-list">
        {displayedGuides.map(guide => (
          <Link key={guide.id} href={`/guides/${guide.id}`} onClick={() => handleClick(guide.id)}>
            <div className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer flex flex-col h-full">
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  onError={(e) => { e.currentTarget.src = "/fallback-image.jpg"; }}
                />
                {guide.pinned && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    GHIM
                  </div>
                )}
                {guide.category && (
                  <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {guide.category}
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                {guide.game && <div className="text-sm text-purple-400 mb-2">{guide.game}</div>}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition line-clamp-2">{guide.title}</h3>
                <p className="text-purple-200 mb-4 line-clamp-3 flex-1">{guide.description}</p>
                <div className="flex items-center space-x-6 text-sm text-purple-300 mt-auto">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{guide.views || 0}</span>
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