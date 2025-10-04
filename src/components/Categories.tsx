"use client";
import { useState, useEffect } from "react";
import { Home, BookOpen, Gamepad2, TrendingUp, Users } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  views: number;
  category: string;
  description: string;
  createdAt: number; // timestamp để sắp xếp
}

const categoriesData = [
  { id: 'news', name: 'Tin mới', icon: Gamepad2 },
  { id: 'code', name: 'Code mới', icon: Users },
  { id: 'strategy', name: 'Strategy', icon: BookOpen }
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState('news'); // mặc định là Tin mới
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const guidesData: Guide[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          views: Number(doc.data().views || 0),
          createdAt: doc.data().createdAt || Date.now(),
        } as Guide));
        setGuides(guidesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    fetchGuides();
  }, []);

  // Lọc và sắp xếp bài viết
  const filteredGuides = guides
    .filter(guide => activeCategory === 'all' || guide.category === activeCategory)
    .sort((a, b) => b.createdAt - a.createdAt); // mới nhất lên đầu

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Thanh chọn category */}
      <div className="flex items-center space-x-4 overflow-x-auto pb-4">
        {categoriesData.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/10 text-purple-300 hover:bg-white/20 border border-purple-500/30'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Hiển thị thẻ bài viết */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGuides.map(guide => (
          <div
            key={guide.id}
            className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer flex flex-col h-full"
          >
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
              <p className="text-purple-200 mb-4 line-clamp-3">{guide.description}</p>
              <div className="flex items-center space-x-6 text-sm text-purple-300 mt-auto">
                <div className="relative flex items-center space-x-1 group cursor-pointer">
                  <Users className="w-4 h-4 transition-colors duration-200 group-hover:text-white" />
                  <span className="transition-colors duration-200 group-hover:text-white">
                    {guide.views}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
