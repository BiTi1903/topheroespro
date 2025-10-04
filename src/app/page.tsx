"use client";

import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedGuides from '../components/FeaturedGuides';
import RecentGuides from '../components/RecentGuides';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Hero />
      <Categories />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FeaturedGuides />
        <div className="space-y-6">
          <RecentGuides />
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
