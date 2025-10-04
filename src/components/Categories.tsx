"use client";
import { useState } from 'react';
import { Home, BookOpen, Gamepad2, TrendingUp, Users } from 'lucide-react';

const categoriesData = [
  { id: 'all', name: 'Tất cả', icon: Home },
  { id: 'rpg', name: 'Tin mới', icon: Gamepad2 },
  { id: 'moba', name: 'Code mới', icon: Users },
  { id: 'fps', name: '', icon: TrendingUp },
  { id: 'strategy', name: 'Strategy', icon: BookOpen }
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  );
}
