"use client";
import React, { useState } from 'react';
import { Castle, Sparkles, ChevronDown } from 'lucide-react';

export default function CastleUpgradeCalculator() {
  const [selectedLevel, setSelectedLevel] = useState<number>(21);
  const [showDropdown, setShowDropdown] = useState(false);

  const castleData: { 
    [key: number]: { 
      wood?: string; 
      stone?: string; 
      ruby?: string; 
      dragonEssence?: string;
      requirements: string;
    } 
  } = {
    21: { wood: '2.04m', stone: '2.04m', ruby: '', requirements: 'Viện Nghiên Cứu (20), Bệnh Viện (20)' },
    22: { wood: '2.30m', stone: '2.30m', ruby: '', requirements: 'Guild (21), Sân Tập (21)' },
    23: { wood: '2.68m', stone: '2.68m', ruby: '', requirements: 'Viện Nghiên Cứu  (22), Bệnh Viện (22)' },
    24: { wood: '3.55m', stone: '3.55m', ruby: '', requirements: 'Guild (23), Sân Tập (23)' },
    25: { wood: '5.76m', stone: '5.76m', ruby: '', requirements: 'Viện Nghiên Cứu  (24), Bệnh Viện (24)' },
    26: { wood: '6.00m', stone: '6.00m', ruby: '', requirements: 'Guild (25), Sân Tập (25)' },
    27: { wood: '7.12m', stone: '7.12m', ruby: '', requirements: 'Viện Nghiên Cứu  (26), Bệnh Viện (26)' },
    28: { wood: '8.55m', stone: '8.55m', ruby: '', requirements: 'Guild (27), Sân Tập (27)' },
    29: { wood: '9.97m', stone: '9.97m', ruby: '1.33m', requirements: 'Viện Nghiên Cứu  (28), Bệnh Viện (28)' },
    30: { wood: '11.8m', stone: '11.8m', ruby: '2.27m', requirements: 'Guild (29), Sân Tập (29)' },
    31: { wood: '13.7m', stone: '13.7m', ruby: '3.23m', requirements: 'Viện Nghiên Cứu  (30), Bệnh Viện (30)' },
    32: { wood: '17.5m', stone: '17.5m', ruby: '4.18m', requirements: 'Guild (31), Sân Tập (31)' },
    33: { wood: '21.3m', stone: '21.3m', ruby: '5.22m', requirements: 'Viện Nghiên Cứu  (32), Bệnh Viện (32)' },
    34: { wood: '30.4m', stone: '30.4m', ruby: '6.36m', requirements: 'Guild (33), Sân Tập (33)' },
    35: { wood: '36.1m', stone: '36.1m', ruby: '11.4m', requirements: 'Viện Nghiên Cứu  (34), Bệnh Viện (34)' },
    36: { wood: '47.5m', stone: '47.5m', ruby: '16.1m', requirements: 'Guild (35), Sân Tập (35)' },
    37: { wood: '61.7m', stone: '61.7m', ruby: '', requirements: 'Viện Nghiên Cứu  (36), Bệnh Viện (36)' },
    38: { wood: '90.2m', stone: '90.2m', ruby: '28m', requirements: 'Guild (37), Sân Tập (37)' },
    39: { wood: '118m', stone: '118m', ruby: '38.9m', requirements: 'Viện Nghiên Cứu  (38), Bệnh Viện (38)' },
    40: { wood: '147m', stone: '147m', ruby: '54.1m', requirements: 'Guild (39), Sân Tập (39)' },
    41: { dragonEssence: '126', wood: '99.7m', ruby: '17.1m', requirements: 'Viện Nghiên Cứu  (40), Bệnh Viện (40)' },
    42: { dragonEssence: '126', wood: '99.7m', ruby: '17.1m', requirements: '' },
    43: { dragonEssence: '126', wood: '99.7m', ruby: '17.1m', requirements: '' },
    44: { dragonEssence: '126', wood: '99.7m', ruby: '17.1m', requirements: '' },
    45: { dragonEssence: '126', wood: '133m', ruby: '22.8m', requirements: 'Lên Quang Huy Level 1' },
    46: { dragonEssence: '151', wood: '166m', ruby: '28.5m', requirements: '' },
    47: { dragonEssence: '151', wood: '166m', ruby: '28.5m', requirements: 'Trại lính Liên Minh (45), Guild (45)' },
    48: { dragonEssence: '151', wood: '166m', ruby: '28.5m', requirements: '' },
    49: { dragonEssence: '151', wood: '166m', ruby: '28.5m', requirements: '' },
    50: { dragonEssence: '151', wood: '249m', ruby: '42.7m', requirements: 'Lên Quang Huy Level 2' },
    51: { dragonEssence: '227', wood: '216m', ruby: '37m', requirements: '' },
    52: { dragonEssence: '227', wood: '216m', ruby: '37m', requirements: 'Trại lính Bộ Tộc (50), Bệnh Viện (50)' },
    53: { dragonEssence: '227', wood: '216m', ruby: '37m', requirements: '' },
    54: { dragonEssence: '227', wood: '216m', ruby: '37m', requirements: '' },
    55: { dragonEssence: '227', wood: '216m', ruby: '37m', requirements: 'Lên Quang Huy Level 3' },
  };

  const levels = Array.from({ length: 35 }, (_, i) => i + 21);

  const getLevelColor = (level: number) => {
    if (level >= 51) return 'text-red-400';
    if (level >= 46) return 'text-orange-400';
    if (level >= 41) return 'text-purple-400';
    if (level >= 35) return 'text-blue-400';
    if (level >= 29) return 'text-cyan-400';
    return 'text-green-400';
  };

  const getLevelBgColor = (level: number) => {
    if (level >= 51) return 'from-red-500/20 to-pink-500/20 border-red-500/50';
    if (level >= 46) return 'from-orange-500/20 to-yellow-500/20 border-orange-500/50';
    if (level >= 41) return 'from-purple-500/20 to-violet-500/20 border-purple-500/50';
    if (level >= 35) return 'from-blue-500/20 to-indigo-500/20 border-blue-500/50';
    if (level >= 29) return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/50';
    return 'from-green-500/20 to-emerald-500/20 border-green-500/50';
  };

  const data = castleData[selectedLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Bảng Nâng Cấp Pháo Đài
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200">Level 21 → 55</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-2xl mb-6">
          
          {/* Level Selection */}
          <div className="mb-6">
            <label className="block text-white font-semibold mb-3 text-lg text-center">
              <Castle className="inline w-6 h-6 mb-1" /> Chọn Level Pháo Đài
            </label>
            <div className="relative max-w-md mx-auto">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
              >
                <div className="flex items-center gap-3">
                  <Castle className={`w-6 h-6 ${getLevelColor(selectedLevel)}`} />
                  <span className="font-bold text-xl">Level {selectedLevel}</span>
                </div>
                <ChevronDown className={`w-6 h-6 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedLevel(level);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-6 py-3 text-left hover:bg-purple-500/30 transition flex items-center gap-3 ${
                        level === selectedLevel ? 'bg-purple-500/20' : ''
                      }`}
                    >
                      <Castle className={`w-5 h-5 ${getLevelColor(level)}`} />
                      <span className="text-white font-semibold">Level {level}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resources Display */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-center text-xl mb-4">Tài nguyên cần thiết</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {data.dragonEssence && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(selectedLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2">
                      <img src="/images/tinhchatrong.png" alt="Dragon Essence" className="w-10 h-10 mx-auto" />
                    </div>
                    <div className="text-cyan-200 text-sm mb-1 font-medium">
                      Tinh Chất Rồng
                    </div>
                    <div className="text-cyan-400 text-2xl font-bold">
                      {data.dragonEssence}
                    </div>
                  </div>
                </div>
              )}
              
              {data.ruby && data.ruby !== '' && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(selectedLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2">
                      <img src="/images/ruby.png" alt="Ruby" className="w-10 h-10 mx-auto" />
                    </div>
                    <div className="text-red-200 text-sm mb-1 font-medium">
                      Ruby
                    </div>
                    <div className="text-red-400 text-2xl font-bold">
                      {data.ruby}
                    </div>
                  </div>
                </div>
              )}
              
              {data.wood && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(selectedLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2">
                      <img src="/images/go.png" alt="Wood" className="w-10 h-10 mx-auto" />
                    </div>
                    <div className="text-yellow-200 text-sm mb-1 font-medium">
                      Gỗ
                    </div>
                    <div className="text-yellow-400 text-2xl font-bold">
                      {data.wood}
                    </div>
                  </div>
                </div>
              )}
              
              {data.stone && data.stone !== '' && (
                <div className={`relative group rounded-xl p-5 text-center bg-gradient-to-br ${getLevelBgColor(selectedLevel)} border-2`}>
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <div className="mb-2">
                      <img src="/images/da.png" alt="Stone" className="w-10 h-10 mx-auto" />
                    </div>
                    <div className="text-gray-200 text-sm mb-1 font-medium">
                      Đá
                    </div>
                    <div className="text-gray-400 text-2xl font-bold">
                      {data.stone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            {data.requirements && (
              <div className="mt-6 bg-purple-500/20 rounded-xl p-5 border border-purple-500/30">
                <h4 className="text-purple-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-xl">📋</span> Điều kiện cần
                </h4>
                <p className="text-white text-sm leading-relaxed">
                  {data.requirements}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Castle className="w-5 h-5" />
            Bảng tham khảo nhanh
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 max-h-96 overflow-y-auto">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 hover:bg-blue-500/20 transition text-left ${
                  level === selectedLevel ? 'ring-2 ring-yellow-400/50' : ''
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Castle className={`w-3 h-3 ${getLevelColor(level)}`} />
                  <span className="text-white text-xs font-bold">LV {level}</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {castleData[level].wood && (
                      <div className="flex items-center gap-1 text-yellow-300 text-xs">
                        <img src="/images/go.png" alt="Wood" className="w-4 h-4" />
                        {castleData[level].wood}
                      </div>
                    )}
                    {castleData[level].stone && castleData[level].stone !== '' && (
                      <div className="flex items-center gap-1 text-gray-300 text-xs">
                        <img src="/images/da.png" alt="Stone" className="w-4 h-4" />
                        {castleData[level].stone}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {castleData[level].dragonEssence && (
                      <div className="flex items-center gap-1 text-cyan-300 text-xs">
                        <img src="/images/tinhchatrong.png" alt="Dragon Essence" className="w-4 h-4" />
                        {castleData[level].dragonEssence}
                      </div>
                    )}
                    {castleData[level].ruby && castleData[level].ruby !== '' && (
                      <div className="flex items-center gap-1 text-red-300 text-xs">
                        <img src="/images/ruby.png" alt="Ruby" className="w-4 h-4" />
                        {castleData[level].ruby}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-500/20">
            <div className="text-blue-200 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Level 21-28: Gỗ + Đá</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Level 29-40: Gỗ + Đá + Ruby</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Level 41-55: Tinh Chất Rồng + Gỗ + Ruby</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}