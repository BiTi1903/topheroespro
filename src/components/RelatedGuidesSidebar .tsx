"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase";
import Link from "next/link";
import { FileText, Eye, ChevronRight } from "lucide-react";

interface RelatedGuide {
  id: string;
  title: string;
  image: string;
  views?: number;
  category?: string;
}

interface RelatedGuidesSidebarProps {
  currentGuideId: string;
  category: string;
  contentOffsetTop?: number; // vị trí content để hiển thị sidebar
}

export default function RelatedGuidesSidebar({
  currentGuideId,
  category,
  contentOffsetTop = 0,
}: RelatedGuidesSidebarProps) {
  const [relatedGuides, setRelatedGuides] = useState<RelatedGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  // Lấy dữ liệu bài viết liên quan
  useEffect(() => {
    const fetchRelatedGuides = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        const guidesRef = collection(db, "guides");
        const q = query(guidesRef, where("category", "==", category), limit(6));
        const querySnapshot = await getDocs(q);

        const guides: RelatedGuide[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentGuideId) {
            const data = doc.data();
            guides.push({
              id: doc.id,
              title: data.title,
              image: data.image,
              views: Number(data.views || 0),
              category: data.category,
            });
          }
        });

        setRelatedGuides(guides);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết liên quan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedGuides();
  }, [currentGuideId, category]);

  // Hiển thị sidebar khi scroll tới content
  useEffect(() => {
    const handleScroll = () => {
      setShowSidebar(window.scrollY >= contentOffsetTop);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [contentOffsetTop]);

  if (loading || !relatedGuides.length || !showSidebar) return null;

  return (
    <div className="fixed top-1/4 right-4 hidden lg:block z-50 w-64">
      <div className="fixed top-1/4 right-4 hidden lg:block z-50 w-64">
  <div className="relative group">
    {/* Glow effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

    {/* Sidebar */}
    <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-xl border border-purple-500/20 shadow-2xl p-2">
      {/* Header */}
      <div className="flex items-center space-x-2 p-2 mb-3">
        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-300" />
        <h4 className="text-sm font-bold text-purple-600 dark:text-purple-300 truncate">
          Bài viết liên quan
        </h4>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {relatedGuides.map((guide) => (
          <li key={guide.id} className="relative group/item">
            {/* Title luôn hiển thị */}
            <Link
              href={`/guides/${guide.id}`}
              className="block px-3 py-2 rounded-lg bg-purple-50 dark:bg-gray-800/60 text-sm font-medium text-gray-800 dark:text-gray-200 truncate cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 transition"
            >
              {guide.title}
            </Link>

            {/* Expand on hover (xuất hiện bên trái) */}
            <div className="absolute top-0 right-full mr-2 w-64 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10">
              <div className="flex gap-3 p-3 bg-white/90 dark:bg-gray-900/90 rounded-lg border border-purple-500/20 shadow-lg">
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {guide.title}
                  </h4>
                  {guide.views !== undefined && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{guide.views}</span>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-purple-500" />
              </div>
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
