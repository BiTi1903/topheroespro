"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, ArrowRight } from "lucide-react";

interface Guide {
  id: string;
  title: string;
  image: string;
  category?: string;
  views?: string;
}

interface RelatedGuidesSidebarProps {
  currentGuideId: string;
  category: string;
}

export default function RelatedGuidesSidebar({
  currentGuideId,
  category,
}: RelatedGuidesSidebarProps) {
  const router = useRouter();
  const [relatedGuides, setRelatedGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchRelatedGuides = async () => {
      try {
        const guidesRef = collection(db, "guides");
        const q = query(guidesRef, where("category", "==", category), limit(6));
        const querySnapshot = await getDocs(q);

        const guides: Guide[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentGuideId) {
            const data = doc.data();
            guides.push({ id: doc.id, ...data } as Guide);
          }
        });

        setRelatedGuides(guides.slice(0, 5));
      } catch (error) {
        console.error("Lỗi khi lấy bài viết liên quan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (category) fetchRelatedGuides();
  }, [currentGuideId, category]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setExpanded(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!hovered) setExpanded(false);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [hovered]);

  if (loading || relatedGuides.length === 0) return null;

  const isExpanded = expanded || hovered;

  return (
    <div className="fixed top-1/4 right-4 hidden lg:block z-50">
      <div
        className="relative group"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hiệu ứng sáng viền */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

        {/* Sidebar */}
        <div
          className={`relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-xl border border-purple-500/20 shadow-2xl transition-all duration-300 overflow-hidden ${
            isExpanded ? "w-50" : "w-[150px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-center space-x-2 p-3 cursor-pointer whitespace-nowrap">
            <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-300 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-wide">
              Liên quan
            </h4>
          </div>

          {/* Divider */}
          <div
            className={`${
              isExpanded ? "h-px" : "h-0"
            } bg-purple-500/20 transition-all duration-300`}
          ></div>

          {/* Navigation List */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[600px]" : "max-h-[160px]"
            }`}
          >
            <ul className="p-2 space-y-2">
              {relatedGuides.map((guide, index) => (
                <li key={guide.id} className="list-none group/item relative">
                  <button
                    onClick={() => router.push(`/guides/${guide.id}`)}
                    className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 text-purple-700 dark:text-purple-200 text-[14px] font-medium transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span
                      className="text-left leading-snug"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: isExpanded ? "170px" : "100px",
                      }}
                      title={guide.title}
                    >
                      {guide.title}
                    </span>
                  </button>

                  {/* Hover card */}
                  <div className="absolute right-full top-0 mr-2 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-purple-500/20 overflow-hidden w-72">
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={guide.image}
                          alt={guide.title}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {guide.category && (
                          <div className="absolute top-2 right-2">
                            <span className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                              {guide.category}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3">
                        <h4 className="text-gray-900 dark:text-white font-bold text-xs mb-2">
                          {guide.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                          {guide.views && (
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{guide.views}</span>
                            </span>
                          )}
                          <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 font-semibold">
                            <span>Xem</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-full top-4 border-8 border-transparent border-l-white dark:border-l-gray-800"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
