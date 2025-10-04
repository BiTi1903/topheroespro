"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

interface Guide {
  id: string;
  title: string;
  game?: string;
  image: string;
  views?: number;
  category?: string;
  description: string;
  createdAt: any; // Firestore Timestamp
  pinned?: boolean;
}

interface Category {
  id: string;
  name: string;
  createdAt: any; // Firestore Timestamp
}

export default function Categories() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy categories
        const categoriesSnapshot = await getDocs(query(collection(db, "categories"), orderBy("name")));
        const categoriesData: Category[] = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];
        setCategories(categoriesData);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleGuideClick = (guideId: string) => {
    router.push(`/guides/${guideId}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <p className="text-purple-500 text-lg">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Thanh chọn category */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
              : "bg-white/10 text-purple-300 hover:bg-white/20 border border-purple-500/30"
          }`}
        >
          <Icons.Grid3X3 className="w-5 h-5" />
          <span>Tất cả</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.name)}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              activeCategory === category.name
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-white/10 text-purple-300 hover:bg-white/20 border border-purple-500/30"
            }`}
          >
            <Icons.Tag className="w-5 h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>


    </div>
  );
}
