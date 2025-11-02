import { useRouter } from "next/navigation";
import { ChevronLeft, Eye } from "lucide-react";
import { Guide } from "../types/guide";

interface HeroSectionProps {
  guide: Guide;
}

export default function HeroSection({ guide }: HeroSectionProps) {
  const router = useRouter();

  return (
    <div className="relative h-[75vh] w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0">
        <img
          src={guide.image}
          alt={guide.title}
          className="w-full h-full object-cover transform scale-105 animate-pulse-slow"
          onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
        />
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-pink-900/40 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/90 dark:from-gray-950/90 via-transparent to-transparent"></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8 z-20">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="group bg-white/20 dark:bg-black/20 backdrop-blur-xl hover:bg-white/30 dark:hover:bg-black/30 text-gray-900 dark:text-white px-6 py-3 rounded-2xl flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/20"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Category Badge */}
      {guide.category && (
        <div className="absolute top-6 right-6 z-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <span className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border border-white/20">
              {guide.category}
            </span>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-4 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent animate-text-shimmer">
                {guide.title}
              </span>
            </h1>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 bg-white/20 dark:bg-black/20 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Eye className="w-5 h-5 text-purple-500" />
                <span className="text-purple-600 dark:text-purple-300 font-semibold">
                  {guide.views || "0"} lượt xem
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}