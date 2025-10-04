import React from 'react';
import { Eye, Clock } from 'lucide-react';

interface PostCardProps {
  id: number | string;
  title: string;
  game: string;
  image: string;
  views: string;
  time: string;
  category: string;
  slug?: string;
}

export default function PostCard({ 
  id, 
  title, 
  game, 
  image, 
  views, 
  time, 
  category,
  slug 
}: PostCardProps) {
  return (
    <a 
      href={`/guides/${slug || id}`}
      className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition cursor-pointer block"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-purple-400 mb-2">{game}</div>
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition">
          {title}
        </h3>
        <div className="flex items-center space-x-6 text-sm text-purple-300">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </a>
  );
}