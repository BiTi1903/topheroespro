"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, Clock } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface Guide {
  id: string;
  title: string;
  game: string;
  image: string;
  views: string;
  time: string;
  category: string;
  description: string;
}

export default function FeaturedGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "guides"));
        const guidesData: Guide[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Guide));
        setGuides(guidesData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
      }
    };

    fetchGuides();
  }, []);

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Hướng dẫn nổi bật</h2>
        <button className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
          <span>Xem tất cả</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {guides.map((guide) => (
    <Link key={guide.id} href={`/guides/${guide.id}`}>
      <div className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer flex flex-col h-full">
        {/* Hình ảnh */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={guide.image}
            alt={guide.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
          {/* <div className="absolute top-4 left-4">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {guide.category}
            </span>
          </div> */}
        </div>

        {/* Nội dung */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-sm text-purple-400 mb-2">{guide.game}</div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
            {guide.title}
          </h3>
          <p className="text-purple-200 mb-4 line-clamp-3">
            {guide.description}
          </p>

          {/* Thông tin lượt xem & thời gian */}
          <div className="flex items-center space-x-6 text-sm text-purple-300 mt-auto">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{guide.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{guide.time}</span>
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
