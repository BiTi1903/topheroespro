"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import * as Icons from "lucide-react";

interface Category {
  id: string;
  name: string;
  createdAt?: Date;
}

interface CategoriesProps {
  onCategoryChange: (category: string) => void;
}

export default function Categories({ onCategoryChange }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(query(collection(db, "categories"), orderBy("name")));
        const categoriesData: Category[] = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data() as { name: string; createdAt?: Timestamp };
          return { id: doc.id, name: data.name, createdAt: data.createdAt?.toDate() };
        });
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    onCategoryChange(categoryName);
  };

  return (
    <div className="relative z-10 py-3 mt-4 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Hiệu ứng fade 2 bên */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-purple-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-purple-900 to-transparent pointer-events-none" />

      <div
        className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Nút "Nổi bật" */}
        <button
          onClick={() => handleClick("all")}
          className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
              : "bg-white/5 text-purple-300 border border-purple-400/30 hover:bg-white/10 hover:text-white"
          }`}
        >
          <Icons.Star className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>🔥 Nổi bật</span>
        </button>

        {/* Danh sách category */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleClick(category.name)}
            className={`flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
              activeCategory === category.name
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-white/5 text-purple-300 border border-purple-400/30 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icons.Tag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
