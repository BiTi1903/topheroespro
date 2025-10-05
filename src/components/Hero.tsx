import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient động background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 animate-gradient-x"></div>

      {/* Glow layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]"></div>

      {/* Nội dung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative text-center z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          <span className="block drop-shadow-lg animate-pulse-slow">
            Nâng Cao Kỹ Năng
          </span>
          <span className="block bg-gradient-to-r from-purple-100 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-text-shine">
            Chinh Phục Topheroes
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-200/90 mb-10 font-light max-w-2xl mx-auto animate-fade-in">
          Hướng dẫn từ cơ bản đến nâng cao cho mọi game thủ – tỏa sáng trên đấu trường Topheroes!
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          <a
            href="https://topheroes.hhgame.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-4 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition duration-300 overflow-hidden group"
          >
            <span className="relative z-10">🚀 Tải Game</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
          </a>

          <a
            href="https://nap.hhgame.vn/top-heroes"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-4 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-pink-600 to-purple-600 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition duration-300 overflow-hidden group"
          >
            <span className="relative z-10">💎 Web Nạp</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
          </a>

          <a
            href="https://topheroes.hhgame.vn/tichnap"
            target="_blank"
            rel="noopener noreferrer"
            className="relative px-4 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition duration-300 overflow-hidden group"
          >
            <span className="relative z-10">💲Web tích nạp</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
          </a>

          {/* 🔹 Nút Thử Vận May */}
          <Link
            href="/vanmay"
            className="relative px-4 py-2 sm:px-10 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition duration-300 overflow-hidden group"
          >
            <span className="relative z-10">🎲 Thử Vận May</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>
          </Link>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
        .animate-text-shine {
          background-size: 300% 300%;
          animation: gradient-x 5s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 2s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
