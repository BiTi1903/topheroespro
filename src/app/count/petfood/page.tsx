"use client";
import { useState } from "react";
import { PawPrint, Sparkles, ChevronDown, TrendingUp } from "lucide-react";

export default function PetFoodCalculator() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(40);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const petData: {
    [key: number]: {
      food: number;
      promo?: string;
      essence?: number;
      needed?: string;
    };
  } = {
    1: { food: 0, promo: "Pet xanh", needed: "1 phôi cùng loại" },
    2: { food: 100 },
    3: { food: 150 },
    4: { food: 200 },
    5: { food: 250 },
    6: { food: 300 },
    7: { food: 400 },
    8: { food: 500 },
    9: { food: 600 },
    10: { food: 700, promo: "⭐", needed: "1 phôi cùng loại" },
    11: { food: 800 },
    12: { food: 900 },
    13: { food: 1000 },
    14: { food: 1100 },
    15: { food: 1200 },
    16: { food: 1300 },
    17: { food: 1400 },
    18: { food: 1500 },
    19: { food: 1600 },
    20: { food: 1700, promo: "⭐⭐", needed: "3 phôi bất kỳ" },
    21: { food: 1800 },
    22: { food: 1900 },
    23: { food: 2000 },
    24: { food: 2100 },
    25: { food: 2200 },
    26: { food: 2300 },
    27: { food: 2400 },
    28: { food: 2500 },
    29: { food: 2600 },
    30: { food: 2750, promo: "⭐⭐⭐", needed: "1 phôi cùng loại" },
    31: { food: 2900 },
    32: { food: 3050 },
    33: { food: 3200 },
    34: { food: 3350 },
    35: { food: 3500, promo: "⭐⭐⭐⭐", needed: "3 phôi bất kỳ" },
    36: { food: 3650 },
    37: { food: 3800 },
    38: { food: 3950 },
    39: { food: 4100 },
    40: { food: 4300, promo: "⭐⭐⭐⭐⭐", needed: "1 phôi cùng loại + 5 phôi bất kỳ" },
    41: { food: 4500 },
    42: { food: 4700 },
    43: { food: 4900 },
    44: { food: 5100 },
    45: { food: 5300, promo: "Pet tím", needed: "1 phôi cùng loại + 5 phôi bất kỳ" },
    46: { food: 5500 },
    47: { food: 5700 },
    48: { food: 5900 },
    49: { food: 6100 },
    50: { food: 6350, promo: "⭐", needed: "2 phôi cùng loại + 5 phôi bất kỳ" },
    51: { food: 6600 },
    52: { food: 6850 },
    53: { food: 7100 },
    54: { food: 7350 },
    55: { food: 7600, promo: "⭐⭐", needed: "2 phôi cùng loại + 10 phôi bất kỳ" },
    56: { food: 7850 },
    57: { food: 8100 },
    58: { food: 8350 },
    59: { food: 8600 },
    60: { food: 8850, promo: "⭐⭐⭐",  needed: "3 phôi cùng loại + 10 phôi bất kỳ" },
    61: { food: 9100 },
    62: { food: 9350 },
    63: { food: 9600 },
    64: { food: 9850 },
    65: { food: 10100, promo: "⭐⭐⭐⭐",  needed: "3 phôi cùng loại + 15 phôi bất kỳ" },
    66: { food: 10350 },
    67: { food: 10600 },
    68: { food: 10850 },
    69: { food: 11100 },
    70: { food: 11350, promo: "⭐⭐⭐⭐⭐", needed: "4 phôi cùng loại + 15 phôi bất kỳ" },
    71: { food: 11600 },
    72: { food: 11900 },
    73: { food: 12200 },
    74: { food: 12500 },
    75: { food: 12800, promo: "Pet vàng",  needed: "5 phôi cùng loại + 15 phôi bất kỳ" },
    76: { food: 13100 },
    77: { food: 13400 },
    78: { food: 13700 },
    79: { food: 14000 },
    80: { food: 14300, promo: "⭐",  needed: "3 phôi cùng loại + 10 phôi bất kỳ + 1000 tinh chất thú cưng" },
    81: { food: 14600 },
    82: { food: 14900 },
    83: { food: 15250 },
    84: { food: 15600 },
    85: { food: 15950, promo: "⭐⭐", needed: "3 phôi cùng loại + 15 phôi bất kỳ" },
    86: { food: 16300 },
    87: { food: 16700 },
    88: { food: 17100 },
    89: { food: 17500 },
    90: { food: 17900, promo: "Pet đỏ", essence: 1000, needed: "3 phôi cùng loại + 10 phôi bất kỳ + 1000 tinh chất thú cưng" },
    91: { food: 5900, essence: 50 },
    100: { food: 7000, essence: 500 },
   
  };

  const levels = Object.keys(petData).map(Number);
  
  const totalFood = levels
    .filter((lv) => lv > currentLevel && lv <= targetLevel)
    .reduce((sum, lv) => sum + (petData[lv]?.food || 0), 0);

  const totalEssence = levels
    .filter((lv) => lv > currentLevel && lv <= targetLevel)
    .reduce((sum, lv) => sum + (petData[lv]?.essence || 0), 0);

  const targetLevelData = petData[targetLevel];
  const targetNeeded = targetLevelData?.needed;
  const targetPromo = targetLevelData?.promo;

  const specialLevels = levels.filter(
    (lv) => lv > currentLevel && lv <= targetLevel && (petData[lv]?.promo || petData[lv]?.essence)
  );

  const getLevelColor = (level: number) => {
    if (level >= 91) return 'text-pink-400';
    if (level >= 75) return 'text-orange-400';
    if (level >= 45) return 'text-purple-400';
    if (level >= 30) return 'text-blue-400';
    if (level >= 20) return 'text-cyan-400';
    if (level >= 10) return 'text-green-400';
    return 'text-gray-400';
  };

  const getLevelBgColor = (level: number) => {
    if (level >= 91) return 'from-pink-500/20 to-red-500/20 border-pink-500/50';
    if (level >= 75) return 'from-orange-500/20 to-yellow-500/20 border-orange-500/50';
    if (level >= 45) return 'from-purple-500/20 to-violet-500/20 border-purple-500/50';
    if (level >= 30) return 'from-blue-500/20 to-indigo-500/20 border-blue-500/50';
    if (level >= 20) return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/50';
    if (level >= 10) return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
    return 'from-gray-500/20 to-slate-500/20 border-gray-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Bảng Tính Nâng Cấp Pet
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200">Level 1 → 100</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-2xl mb-6">
          
          {/* Level Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Current Level */}
            <div>
              <label className="block text-white font-semibold mb-3 text-center">
                <TrendingUp className="inline w-5 h-5 mb-1" /> Level hiện tại
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCurrentDropdown(!showCurrentDropdown);
                    setShowTargetDropdown(false);
                  }}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
                >
                  <div className="flex items-center gap-3">
                    <PawPrint className={`w-6 h-6 ${getLevelColor(currentLevel)}`} />
                    <span className="font-bold text-xl">Level {currentLevel}</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform ${showCurrentDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCurrentDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {levels.map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          setCurrentLevel(level);
                          if (level >= targetLevel) setTargetLevel(level + 1);
                          setShowCurrentDropdown(false);
                        }}
                        className={`w-full px-6 py-3 text-left hover:bg-purple-500/30 transition flex items-center gap-3 ${
                          level === currentLevel ? 'bg-purple-500/20' : ''
                        }`}
                      >
                        <PawPrint className={`w-5 h-5 ${getLevelColor(level)}`} />
                        <span className="text-white font-semibold">Level {level}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Level */}
            <div>
              <label className="block text-white font-semibold mb-3 text-center">
                <Sparkles className="inline w-5 h-5 mb-1" /> Level mục tiêu
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowTargetDropdown(!showTargetDropdown);
                    setShowCurrentDropdown(false);
                  }}
                  className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
                >
                  <div className="flex items-center gap-3">
                    <PawPrint className={`w-6 h-6 ${getLevelColor(targetLevel)}`} />
                    <span className="font-bold text-xl">Level {targetLevel}</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform ${showTargetDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showTargetDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {levels.filter(lv => lv > currentLevel).map(level => (
                      <button
                        key={level}
                        onClick={() => {
                          setTargetLevel(level);
                          setShowTargetDropdown(false);
                        }}
                        className={`w-full px-6 py-3 text-left hover:bg-purple-500/30 transition flex items-center gap-3 ${
                          level === targetLevel ? 'bg-purple-500/20' : ''
                        }`}
                      >
                        <PawPrint className={`w-5 h-5 ${getLevelColor(level)}`} />
                        <span className="text-white font-semibold">Level {level}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resources Display */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-center text-xl mb-4">Tài nguyên cần thiết</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(targetLevel)} border-2`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative">
                  <div className="mb-2 text-4xl">🍖</div>
                  <div className="text-yellow-200 text-sm mb-1 font-medium">Thức ăn Pet</div>
                  <div className="text-yellow-400 text-2xl font-bold">{totalFood.toLocaleString()}</div>
                </div>
              </div>
              
              {totalEssence > 0 && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(targetLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2 text-4xl">✨</div>
                    <div className="text-cyan-200 text-sm mb-1 font-medium">Tinh chất Thú Cưng</div>
                    <div className="text-cyan-400 text-2xl font-bold">{totalEssence.toLocaleString()}</div>
                  </div>
                </div>
              )}
              
              {targetNeeded && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(targetLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2 text-4xl">🐾</div>
                    <div className="text-pink-200 text-sm mb-1 font-medium">Phôi cần thiết</div>
                    <div className="text-pink-100 text-lg font-bold">{targetNeeded}</div>
                    {targetPromo && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full text-xs font-black text-white shadow-lg">
                          {targetPromo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Reference Table - All Levels */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <PawPrint className="w-5 h-5" />
            Bảng tham khảo nhanh - Tất cả Level
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[600px] overflow-y-auto">
            {levels.map((level) => {
              const d = petData[level];
              const isInRange = level > currentLevel && level <= targetLevel;
              const isTarget = level === targetLevel;
              return (
                <button
                  key={level}
                  onClick={() => setTargetLevel(level)}
                  className={`bg-blue-500/10 rounded-lg p-2 border border-blue-500/20 hover:bg-blue-500/20 transition text-left ${
                    isTarget ? 'ring-2 ring-pink-400/70 bg-pink-500/20' : 
                    isInRange ? 'bg-yellow-500/10 border-yellow-400/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <PawPrint className={`w-3 h-3 ${getLevelColor(level)}`} />
                    <span className="text-white text-[10px] font-bold">LV{level}</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-yellow-300 text-[10px] font-semibold">
                      🍖 {d.food >= 1000 ? `${(d.food / 1000).toFixed(1)}k` : d.food}
                    </div>
                    {d.essence && (
                      <div className="text-cyan-300 text-[10px] font-semibold">
                        ✨ {d.essence}
                      </div>
                    )}
                    {d.promo && (
                      <div className="mt-0.5">
                        <span className="inline-block px-1 py-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 rounded text-[8px] font-bold text-white">
                          {d.promo.length > 10 ? '⭐' : d.promo}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <div className="text-blue-200 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Level 1-19: Pet Food</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Level 20-44: Pet Food + Promotion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Level 45-90: Pet Food + Pet Essence</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Level 91+: Mythic Pets</span>
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-500/20">
                <div className="w-2 h-2 bg-pink-400 rounded-full ring-2 ring-pink-400"></div>
                <span>Level mục tiêu | </span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Trong khoảng chọn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}