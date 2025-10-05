"use client";
import React, { useState } from 'react';
import { Star, Sparkles, RotateCcw, ArrowRight, ChevronDown } from 'lucide-react';

type StarLevel = 'gold-0' | 'gold-1' | 'gold-2' | 'gold-3' | 'gold-4' | 'gold-5' | 
                'red-0' | 'red-1' | 'red-2' | 'red-3' | 'red-4' | 'red-5' |
                'white-0' | 'white-1' | 'white-2' | 'white-3' | 'white-4' | 'white-5';

export default function HeroFragmentCalculator() {
  const [heroType, setHeroType] = useState<'legendary' | 'mythical'>('legendary');
  const [currentLevel, setCurrentLevel] = useState<StarLevel>('gold-0');
  const [targetLevel, setTargetLevel] = useState<StarLevel>('gold-1');
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const legendaryFragments = {
    gold: [5, 5, 10, 10, 20],
    red: [30, 20, 20, 40, 40],
    white: [80, 20, 40, 80, 80]
  };

  const mythicalFragments = {
    gold: [10, 10, 20, 20, 40],
    red: [60, 40, 40, 80, 80],
    white: [160, 40, 80, 160, 160]
  };

  const fragments = heroType === 'legendary' ? legendaryFragments : mythicalFragments;

  const starLevels: { value: StarLevel; label: string; order: number; color: string }[] = [
    { value: 'gold-0', label: 'Vàng 0 sao', order: 0, color: 'gold' },
    { value: 'gold-1', label: 'Vàng 1 sao', order: 1, color: 'gold' },
    { value: 'gold-2', label: 'Vàng 2 sao', order: 2, color: 'gold' },
    { value: 'gold-3', label: 'Vàng 3 sao', order: 3, color: 'gold' },
    { value: 'gold-4', label: 'Vàng 4 sao', order: 4, color: 'gold' },
    { value: 'gold-5', label: 'Vàng 5 sao', order: 5, color: 'gold' },
    { value: 'red-0', label: 'Đỏ 0 sao', order: 6, color: 'red' },
    { value: 'red-1', label: 'Đỏ 1 sao', order: 7, color: 'red' },
    { value: 'red-2', label: 'Đỏ 2 sao', order: 8, color: 'red' },
    { value: 'red-3', label: 'Đỏ 3 sao', order: 9, color: 'red' },
    { value: 'red-4', label: 'Đỏ 4 sao', order: 10, color: 'red' },
    { value: 'red-5', label: 'Đỏ 5 sao', order: 11, color: 'red' },
    { value: 'white-0', label: 'Trắng 0 sao', order: 12, color: 'white' },
    { value: 'white-1', label: 'Trắng 1 sao', order: 13, color: 'white' },
    { value: 'white-2', label: 'Trắng 2 sao', order: 14, color: 'white' },
    { value: 'white-3', label: 'Trắng 3 sao', order: 15, color: 'white' },
    { value: 'white-4', label: 'Trắng 4 sao', order: 16, color: 'white' },
    { value: 'white-5', label: 'Trắng 5 sao', order: 17, color: 'white' },
  ];

  const calculateFragments = () => {
    const currentOrder = starLevels.find(l => l.value === currentLevel)?.order || 0;
    const targetOrder = starLevels.find(l => l.value === targetLevel)?.order || 0;

    if (targetOrder <= currentOrder) return { gold: 0, red: 0, white: 0, total: 0 };

    let goldTotal = 0, redTotal = 0, whiteTotal = 0;

    for (let i = currentOrder; i < targetOrder; i++) {
      const level = starLevels[i].value;
      const [color, star] = level.split('-');
      const starNum = parseInt(star);

      if (color === 'gold' && starNum < 5) {
        goldTotal += fragments.gold[starNum];
      } else if (color === 'red' && starNum < 5) {
        redTotal += fragments.red[starNum];
      } else if (color === 'white' && starNum < 5) {
        whiteTotal += fragments.white[starNum];
      }
    }

    return { 
      gold: goldTotal, 
      red: redTotal, 
      white: whiteTotal, 
      total: goldTotal + redTotal + whiteTotal 
    };
  };

  const result = calculateFragments();

  const handleReset = () => {
    setCurrentLevel('gold-0');
    setTargetLevel('gold-1');
  };

  const getValidTargetLevels = () => {
    const currentOrder = starLevels.find(l => l.value === currentLevel)?.order || 0;
    
    if (currentLevel === 'gold-5') {
      return starLevels.filter(l => l.order >= 7);
    }
    
    if (currentLevel === 'red-5') {
      return starLevels.filter(l => l.order >= 13);
    }
    
    return starLevels.filter(l => l.order > currentOrder);
  };

  const getValidCurrentLevels = () => {
    return starLevels.filter(l => l.value !== 'white-5');
  };

  const renderStars = (count: number, color: string) => {
    const stars = [];
    const colorClass = color === 'gold' ? 'text-yellow-400' : color === 'red' ? 'text-red-500' : 'text-white';
    const fillClass = color === 'gold' ? 'fill-yellow-400' : color === 'red' ? 'fill-red-500' : 'fill-white';
    
    for (let i = 0; i < count; i++) {
      stars.push(
        <Star key={i} className={`w-4 h-4 ${colorClass} ${fillClass}`} />
      );
    }
    return stars;
  };

  const CustomDropdown = ({ 
    value, 
    options, 
    onChange, 
    isOpen, 
    setIsOpen 
  }: { 
    value: StarLevel; 
    options: typeof starLevels;
    onChange: (value: StarLevel) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
  }) => {
    const selected = options.find(o => o.value === value);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {renderStars(parseInt(value.split('-')[1]), selected?.color || 'gold')}
            </div>
            <span className="font-medium">{selected?.label}</span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-purple-500/30 transition flex items-center gap-2 ${
                  option.value === value ? 'bg-purple-500/20' : ''
                }`}
              >
                <div className="flex gap-0.5">
                  {renderStars(parseInt(option.value.split('-')[1]), option.color)}
                </div>
                <span className="text-white">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
               Tính Mảnh Nâng Cấp Anh Hùng
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-purple-200">Tính số mảnh cần thiết để nâng sao</p>
        </div>

        {/* Chọn loại tướng */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => {
              setHeroType('legendary');
              setCurrentLevel('gold-0');
              setTargetLevel('gold-1');
            }}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
              heroType === 'legendary'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            Huyền Thoại
          </button>
          <button
            onClick={() => {
              setHeroType('mythical');
              setCurrentLevel('gold-0');
              setTargetLevel('gold-1');
            }}
            className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 ${
              heroType === 'mythical'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/10 text-purple-300 hover:bg-white/20'
            }`}
          >
            Thần Thoại
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-2xl mb-4">
          
          {/* Chọn cấp độ */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">Hiện tại</label>
              <CustomDropdown
                value={currentLevel}
                options={getValidCurrentLevels()}
                onChange={(newValue) => {
                  setCurrentLevel(newValue);
                  const newOrder = starLevels.find(l => l.value === newValue)?.order || 0;
                  const nextLevel = starLevels.find(l => l.order === newOrder + 1);
                  if (nextLevel) {
                    setTargetLevel(nextLevel.value);
                  }
                }}
                isOpen={showCurrentDropdown}
                setIsOpen={setShowCurrentDropdown}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Mục tiêu</label>
              <CustomDropdown
                value={targetLevel}
                options={getValidTargetLevels()}
                onChange={setTargetLevel}
                isOpen={showTargetDropdown}
                setIsOpen={setShowTargetDropdown}
              />
            </div>
          </div>

          {/* Hiển thị chuyển đổi */}
          <div className="flex items-center justify-center gap-3 mb-6 bg-purple-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderStars(
                  parseInt(currentLevel.split('-')[1]), 
                  starLevels.find(l => l.value === currentLevel)?.color || 'gold'
                )}
              </div>
              <span className="text-white font-medium text-sm">
                {starLevels.find(l => l.value === currentLevel)?.label}
              </span>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-300" />
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {renderStars(
                  parseInt(targetLevel.split('-')[1]), 
                  starLevels.find(l => l.value === targetLevel)?.color || 'gold'
                )}
              </div>
              <span className="text-white font-medium text-sm">
                {starLevels.find(l => l.value === targetLevel)?.label}
              </span>
            </div>
          </div>

          {/* Kết quả */}
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-4 text-center border ${
              result.gold > 0 
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                : 'bg-white/5 border-gray-500/20'
            }`}>
              <div className={`text-xs mb-1 ${result.gold > 0 ? 'text-yellow-200' : 'text-gray-400'}`}>
                Mảnh Vàng
              </div>
              <div className={`text-2xl font-bold ${result.gold > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {result.gold}
              </div>
            </div>

            <div className={`rounded-xl p-4 text-center border ${
              result.red > 0 
                ? 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/50' 
                : 'bg-white/5 border-gray-500/20'
            }`}>
              <div className={`text-xs mb-1 ${result.red > 0 ? 'text-red-200' : 'text-gray-400'}`}>
                Mảnh Đỏ
              </div>
              <div className={`text-2xl font-bold ${result.red > 0 ? 'text-red-400' : 'text-gray-500'}`}>
                {result.red}
              </div>
            </div>

            <div className={`rounded-xl p-4 text-center border ${
              result.white > 0 
                ? 'bg-gradient-to-br from-white/20 to-gray-300/20 border-white/50' 
                : 'bg-white/5 border-gray-500/20'
            }`}>
              <div className={`text-xs mb-1 ${result.white > 0 ? 'text-white/80' : 'text-gray-400'}`}>
                Mảnh Trắng
              </div>
              <div className={`text-2xl font-bold ${result.white > 0 ? 'text-white' : 'text-gray-500'}`}>
                {result.white}
              </div>
            </div>
          </div>
        </div>

        {/* Tổng kết */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-5 shadow-2xl mb-4 flex items-center justify-center gap-3">
  <div className="text-white/90 font-semibold">Tổng cộng:</div>
  <div className="text-white font-semibold">{result.total} mảnh</div>
</div>


        {/* Info Box */}
        {/* Info Box */}
        <div className="mt-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-4 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 text-center text-sm">
            📊 Bảng mảnh {heroType === 'legendary' ? 'Huyền Thoại' : 'Thần Thoại'}
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <div className="text-yellow-300 font-bold mb-2 text-center">⭐ Vàng</div>
              <div className="text-yellow-100 space-y-1">
                {fragments.gold.map((val, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-yellow-200/70">{i}→{i+1}:</span>
                    <span className="font-semibold">{val} mảnh</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
              <div className="text-red-300 font-bold mb-2 text-center">🔴 Đỏ</div>
              <div className="text-red-100 space-y-1">
                {fragments.red.map((val, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-red-200/70">{i}→{i+1}:</span>
                    <span className="font-semibold">{val} mảnh</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 border border-white/20">
              <div className="text-white font-bold mb-2 text-center">⚪ Trắng</div>
              <div className="text-white/90 space-y-1">
                {fragments.white.map((val, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-white/60">{i}→{i+1}:</span>
                    <span className="font-semibold">{val} mảnh</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}