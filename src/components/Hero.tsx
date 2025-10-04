export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Nâng Cao Kỹ Năng
          <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Chinh Phục Topheroes
          </span>
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Hướng dẫn từ cơ bản đến nâng cao cho mọi game th
        </p>
        <div className="flex items-center justify-center space-x-4">
          <a
  href="https://topheroes.hhgame.vn/"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold border border-purple-500/30 hover:bg-white/20 transition cursor-pointer inline-block"
>
  Trang chủ Game
</a>

          <a
  href="https://nap.hhgame.vn/top-heroes"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold border border-purple-500/30 hover:bg-white/20 transition cursor-pointer inline-block"
>
  Trang nạp
</a>

        </div>
      </div>
    </div>
  );
}
