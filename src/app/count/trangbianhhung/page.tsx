"use client";
import React, { useState } from 'react';
import { Shield, Sparkles, Gem, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';


export default function HeroGearUpgradeCalculator() {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(1);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const gearData: { [key: number]: { rune: number; ruby: number } } = {
    1: { rune: 1500, ruby: 7200 },
    2: { rune: 1500, ruby: 7200 },
    3: { rune: 1500, ruby: 7200 },
    4: { rune: 1500, ruby: 7200 },
    5: { rune: 2250, ruby: 10800 },
    6: { rune: 2250, ruby: 10800 },
    7: { rune: 2250, ruby: 10800 },
    8: { rune: 2250, ruby: 10800 },
    9: { rune: 3000, ruby: 14400 },
    10: { rune: 3000, ruby: 14400 },
    11: { rune: 3000, ruby: 14400 },
    12: { rune: 3000, ruby: 14400 },
    13: { rune: 3750, ruby: 18000 },
    14: { rune: 3750, ruby: 18000 },
    15: { rune: 3750, ruby: 18000 },
    16: { rune: 3750, ruby: 18000 },
    17: { rune: 4500, ruby: 21600 },
    18: { rune: 4500, ruby: 21600 },
    19: { rune: 4500, ruby: 21600 },
    20: { rune: 4500, ruby: 21600 },
    21: { rune: 5250, ruby: 25200 },
    22: { rune: 5250, ruby: 25200 },
    23: { rune: 5250, ruby: 25200 },
    24: { rune: 5250, ruby: 25200 },
    25: { rune: 6000, ruby: 28800 },
    26: { rune: 6000, ruby: 28800 },
    27: { rune: 6000, ruby: 28800 },
    28: { rune: 6000, ruby: 28800 },
    29: { rune: 6750, ruby: 32400 },
    30: { rune: 6750, ruby: 32400 },
    31: { rune: 6750, ruby: 32400 },
    32: { rune: 6750, ruby: 32400 },
    33: { rune: 7500, ruby: 36000 },
    34: { rune: 7500, ruby: 36000 },
    35: { rune: 7500, ruby: 36000 },
    36: { rune: 7500, ruby: 36000 },
    37: { rune: 8250, ruby: 39600 },
    38: { rune: 8250, ruby: 39600 },
    39: { rune: 8250, ruby: 39600 },
    40: { rune: 8250, ruby: 39600 }
  };

  const levels = Array.from({ length: 41 }, (_, i) => i);

  const calculateTotal = () => {
    if (targetLevel <= currentLevel) return { rune: 0, ruby: 0 };
    
    let totalRune = 0;
    let totalRuby = 0;
    
    // Cộng từ currentLevel+1 đến targetLevel (ví dụ: level 0→5 thì cộng level 1,2,3,4,5)
    for (let i = currentLevel + 1; i <= targetLevel; i++) {
      totalRune += gearData[i].rune;
      totalRuby += gearData[i].ruby;
    }
    
    return { rune: totalRune, ruby: totalRuby };
  };

  const result = calculateTotal();

  const getLevelColor = (level: number) => {
    if (level >= 33) return 'text-red-400';
    if (level >= 25) return 'text-purple-400';
    if (level >= 17) return 'text-blue-400';
    if (level >= 9) return 'text-cyan-400';
    return 'text-green-400';
  };

  const getLevelBgColor = (level: number) => {
    if (level >= 33) return 'from-red-500/20 to-pink-500/20 border-red-500/50';
    if (level >= 25) return 'from-purple-500/20 to-violet-500/20 border-purple-500/50';
    if (level >= 17) return 'from-blue-500/20 to-indigo-500/20 border-blue-500/50';
    if (level >= 9) return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/50';
    return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
  };

  const CustomDropdown = ({ 
    value, 
    options, 
    onChange, 
    isOpen, 
    setIsOpen 
  }: { 
    value: number; 
    options: number[];
    onChange: (value: number) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }) => {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
        >
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${getLevelColor(value)}`} />
            <span className="font-medium">Level {value}</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {options.map(option => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-purple-500/30 transition flex items-center gap-2 ${
                  option === value ? 'bg-purple-500/20' : ''
                }`}
              >
                <Shield className={`w-4 h-4 ${getLevelColor(option)}`} />
                <span className="text-white text-sm">Level {option}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Nâng Cấp Trang Bị Anh Hùng
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200">Tính toán tài nguyên cần thiết để nâng cấp</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-2xl mb-6">
          
          {/* Level Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Level hiện tại</label>
              <CustomDropdown
                value={currentLevel}
                options={levels.filter(l => l < 40)}
                onChange={(newValue) => {
                  setCurrentLevel(newValue);
                  if (targetLevel <= newValue) {
                    setTargetLevel(newValue + 1);
                  }
                }}
                isOpen={showCurrentDropdown}
                setIsOpen={setShowCurrentDropdown}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Level mục tiêu</label>
              <CustomDropdown
                value={targetLevel}
                options={levels.filter(l => l > currentLevel)}
                onChange={setTargetLevel}
                isOpen={showTargetDropdown}
                setIsOpen={setShowTargetDropdown}
              />
            </div>
          </div>

          {/* Level Display */}
          <div className="flex items-center justify-center gap-3 mb-6 bg-purple-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getLevelColor(currentLevel)}`} />
              <span className="text-white font-medium">Level {currentLevel}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-300" />
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getLevelColor(targetLevel)}`} />
              <span className="text-white font-medium">Level {targetLevel}</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`relative group rounded-2xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(targetLevel)} border-2`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              {/* Rune */}
<div className="relative">
  <Image
    src="/images/runecuonghoatrangbi.png"
    alt="Rune"
    width={40}
    height={40}
    className="mx-auto mb-2"
  />
  <div className="text-blue-200 text-sm mb-1 font-medium">
    Tổng Rune cần
  </div>
  <div className="text-blue-400 text-3xl font-bold">
    {result.rune.toLocaleString('en-US')}
  </div>
</div>

{/* Ruby */}


            </div>

            <div className={`relative group rounded-2xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(targetLevel)} border-2`}>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative">
  <Image
    src="/images/ruby.png"
    alt="Ruby"
    width={40}
    height={40}
    className="mx-auto mb-2"
  />
  <div className="text-red-200 text-sm mb-1 font-medium">
    Tổng Ruby cần
  </div>
  <div className="text-red-400 text-3xl font-bold">
    {result.ruby.toLocaleString('en-US')}
  </div>
</div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Bảng chi tiết nâng cấp
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {levels.slice(1, 41).map((level) => (
              <div 
                key={level}
                className={`bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 hover:bg-blue-500/20 transition ${
                  level > currentLevel && level <= targetLevel ? 'ring-2 ring-yellow-400/50' : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-2">
                  <Shield className={`w-3 h-3 ${getLevelColor(level)}`} />
                  <span className="text-white text-xs font-bold">Lv {level}</span>
                </div>
                <div className="space-y-1">
                     <div className="flex justify-between text-xs">
                    <span className="text-blue-300">Rune:</span>
                    <span className="text-blue-200 font-semibold">{gearData[level].rune.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-300">Ruby:</span>
                    <span className="text-red-200 font-semibold">{gearData[level].ruby.toLocaleString('en-US')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          
        </div>
      </div>
    </div>
  );
}