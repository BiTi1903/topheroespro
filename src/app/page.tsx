"use client";

import { useState } from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedGuides from '../components/FeaturedGuides';
import RecentGuides from '../components/RecentGuides';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Hero />

      {/* Category chỉ làm sự kiện click */}
      <Categories onCategoryChange={setActiveCategory} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: FeaturedGuides lọc theo category */}
        <FeaturedGuides activeCategory={activeCategory === "all" ? undefined : activeCategory} />

        {/* Cột phải: RecentGuides + Newsletter */}
        <div className="space-y-6">
          <RecentGuides />
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
