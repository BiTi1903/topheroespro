"use client";
import { Star } from 'lucide-react';

const recentGuides = [
  { title: 'Cách farm tài nguyên hiệu quả', game: '...', time: '2 giờ trước' },
  { title: 'Các gói nên mua', game: '...', time: '5 giờ trước' },
  { title: 'Tips hay trong game', game: '...', time: '1 ngày trước' },
  { title: 'Tính số điểm đua event  ', game: '...', time: '2 ngày trước' }
];

export default function RecentGuides() {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>Mới cập nhật</span>
      </h3>
      <div className="space-y-4">
        {recentGuides.map((guide, index) => (
          <div
            key={index}
            className="pb-4 border-b border-purple-500/20 last:border-0 hover:bg-white/5 p-2 rounded-lg transition cursor-pointer"
          >
            <h4 className="text-white font-medium mb-1 hover:text-purple-400 transition">
              {guide.title}
            </h4>
            <div className="flex items-center justify-between text-sm text-purple-300">
              <span>{guide.game}</span>
              <span>{guide.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
