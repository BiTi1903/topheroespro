import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  showCTA?: boolean;
}

export default function Header({ title, subtitle, showCTA = true }: HeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {title.split('\n').map((line, idx) => (
              <span
                key={idx}
                className={idx === 0 ? '' : 'block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-purple-200 mb-8">{subtitle}</p>

          {/* CTA Buttons */}
          {showCTA && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition w-full sm:w-auto">
                Khám phá ngay
              </button>
              <button className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold border border-purple-500/30 hover:bg-white/20 transition w-full sm:w-auto">
                Xem video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
