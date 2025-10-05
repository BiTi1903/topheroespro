"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, DocumentData, Timestamp } from "firebase/firestore";
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
        const categoriesSnapshot = await getDocs(
          query(collection(db, "categories"), orderBy("name"))
        );

        const categoriesData: Category[] = categoriesSnapshot.docs.map(doc => {
          const data = doc.data() as {
            name: string;
            createdAt?: Timestamp;
          };
          return {
            id: doc.id,
            name: data.name,
            createdAt: data.createdAt?.toDate(), // convert Timestamp -> Date
          };
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
    <div className="relative z-10 py-4 mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4">
    <button
      onClick={() => handleClick("all")}
      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ease-out transform cursor-pointer whitespace-nowrap ${
        activeCategory === "all"
          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105"
          : "bg-white/10 text-purple-300 hover:bg-white/20 hover:scale-105 hover:shadow-md border border-purple-500/30"
      } active:scale-95`}
    >
      <Icons.Grid3X3 className="w-5 h-5" />
      <span>{activeCategory === "all" ? "🔥  Nổi bật" : "🔥  Nổi bật"}</span>
    </button>

    {categories.map(category => (
      <button
        key={category.id}
        onClick={() => handleClick(category.name)}
        className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ease-out transform cursor-pointer whitespace-nowrap ${
          activeCategory === category.name
            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105"
            : "bg-white/10 text-purple-300 hover:bg-white/20 hover:scale-105 hover:shadow-md border border-purple-500/30"
        } active:scale-95`}
      >
        <Icons.Tag className="w-5 h-5" />
        <span>{category.name}</span>
      </button>
    ))}
  </div>
</div>


  );
}
