"use client";
import React, { useState } from "react";
import { Sparkles, Gem, Calculator, RefreshCw } from "lucide-react";

export default function RechargeCalculator() {
  const [points, setPoints] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const vipLevels = [
    { level: 1, points: 6 },
    { level: 2, points: 60 },
    { level: 3, points: 100 },
    { level: 4, points: 300 },
    { level: 5, points: 500 },
    { level: 6, points: 1000 },
    { level: 7, points: 3000 },
    { level: 8, points: 6000 },
    { level: 9, points: 10000 },
    { level: 10, points: 30000 },
    { level: 11, points: 50000 },
    { level: 12, points: 80000 },
    { level: 13, points: 120000 },
    { level: 14, points: 160000 },
    { level: 15, points: 200000 },
    { level: 16, points: 300000 },
    { level: 17, points: 600000 },
    { level: 18, points: 1000000 },
  ];

  const calculateMoney = () => {
    const pointValue = parseFloat(points) || 0;
    return Math.floor((pointValue * 2200000) / 648);
  };

  const money = calculateMoney();

  const handleSelectVIP = (vipPoints: number) => {
    setPoints(vipPoints.toString());
    setShowResult(true);
  };

  const handleReset = () => {
    setPoints("");
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Tính Tiền Theo Điểm Vip
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200">
            Chọn cấp VIP để xem số tiền tương ứng
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 md:p-8 shadow-2xl mb-6">
          {/* Quick VIP Buttons */}
          <div className="mb-6">
            <div className="text-white/70 text-sm mb-2">Chọn cấp VIP:</div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {vipLevels.map((vip) => (
                <button
                  key={vip.level}
                  onClick={() => handleSelectVIP(vip.points)}
                  className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 hover:border-purple-500/60 text-white px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer"
                >
                  VIP {vip.level}
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3 text-lg">
              <Gem className="inline w-5 h-5 mb-1" /> Số điểm Vip hiện tại của bạn
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => {
                setPoints(e.target.value);
                setShowResult(false);
              }}
              placeholder="Nhập điểm thủ công..."
              className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-4 text-white text-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition placeholder-purple-300/50"
              min="0"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setShowResult(true)}
              disabled={!points || parseFloat(points) <= 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 cursor-pointer"
            >
              <Calculator className="w-5 h-5" />
              Tính toán
            </button>

            <button
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20 border border-purple-500/30 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              Làm mới
            </button>
          </div>

          {/* Result */}
          {showResult && points && parseFloat(points) > 0 && (
            <div className="animate-scaleIn">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-2xl p-6 text-center">
                  <div className="text-green-200 text-sm mb-2 font-medium">
                    Số tiền tương ứng
                  </div>
                  <div className="text-green-400 text-5xl font-bold mb-2">
                    {money.toLocaleString("vi-VN")}
                  </div>
                  <div className="text-green-300 text-lg font-semibold">
                    VNĐ
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
Lưu ý          </div>
          <div className="space-y-2 text-blue-100 text-sm">
            <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg p-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <span className="font-semibold">
                  Điểm VIP có thể nhận thêm từ hoạt động trong game.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg p-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <span className="font-semibold">
                  Số tiền hiển thị chỉ mang tính chất tham khảo (80-90%).
                </span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
