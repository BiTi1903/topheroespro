"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Sparkles, Calculator, RotateCcw, ArrowRight, ChevronDown } from 'lucide-react';

export default function ExclusiveEquipmentCalculator() {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [targetLevel, setTargetLevel] = useState<number>(1);
  const [showCurrentDropdown, setShowCurrentDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  // ✅ Sửa lại bảng — bắt đầu từ 0 → 1 = 5
  const fragmentsRequired: { [key: number]: number } = {
    0: 5,
    1: 10,
    2: 15,
    3: 20,
    4: 25,
    5: 30,
    6: 35,
    7: 40,
    8: 45,
    9: 50,
    10: 55,
    11: 60,
    12: 65,
    13: 70,
    14: 80,
    15: 90,
    16: 100,
    17: 110,
    18: 130,
    19: 150,
  };

  const levels = Array.from({ length: 21 }, (_, i) => i);

  const calculateTotalFragments = () => {
    if (targetLevel <= currentLevel) return 0;
    let total = 0;
    for (let i = currentLevel; i < targetLevel; i++) {
      total += fragmentsRequired[i] || 0;
    }
    return total;
  };

  const handleReset = () => {
    setCurrentLevel(0);
    setTargetLevel(1);
  };

  const getValidTargetLevels = () => levels.filter((l) => l > currentLevel);
  const getValidCurrentLevels = () => levels.filter((l) => l < 20);
  const totalFragments = calculateTotalFragments();

  const getLevelColor = (level: number) => {
    if (level >= 15) return 'text-red-400';
    if (level >= 10) return 'text-purple-400';
    if (level >= 5) return 'text-blue-400';
    return 'text-green-400';
  };

  const CustomDropdown = ({
    value,
    options,
    onChange,
    isOpen,
    setIsOpen,
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
          className="w-full bg-white/10 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none cursor-pointer flex items-center justify-between hover:bg-white/15 transition"
        >
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${getLevelColor(value)}`} />
            <span className="font-medium">Cấp {value}</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-purple-500/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-purple-500/30 transition flex items-center gap-2 ${
                  option === value ? 'bg-purple-500/20' : ''
                }`}
              >
                <Shield className={`w-4 h-4 ${getLevelColor(option)}`} />
                <span className="text-white">Cấp {option}</span>
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
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent"></div>
          <h1 className="absolute bottom-6 left-6 text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            <Sparkles className="text-yellow-400 w-7 h-7" />
            Tính Mảnh Trang Bị Độc Quyền
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-6 shadow-2xl mb-4">
          {/* Level Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Cấp hiện tại
              </label>
              <CustomDropdown
                value={currentLevel}
                options={getValidCurrentLevels()}
                onChange={(newValue) => {
                  setCurrentLevel(newValue);
                  if (targetLevel <= newValue) setTargetLevel(newValue + 1);
                }}
                isOpen={showCurrentDropdown}
                setIsOpen={setShowCurrentDropdown}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Cấp mục tiêu
              </label>
              <CustomDropdown
                value={targetLevel}
                options={getValidTargetLevels()}
                onChange={setTargetLevel}
                isOpen={showTargetDropdown}
                setIsOpen={setShowTargetDropdown}
              />
            </div>
          </div>

          {/* Conversion Display */}
          <div className="flex items-center justify-center gap-3 mb-6 bg-purple-500/20 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getLevelColor(currentLevel)}`} />
              <span className="text-white font-medium">Cấp {currentLevel}</span>
            </div>
            <ArrowRight className="w-6 h-6 text-purple-300" />
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${getLevelColor(targetLevel)}`} />
              <span className="text-white font-medium">Cấp {targetLevel}</span>
            </div>
          </div>

          {/* Result */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-500/50 rounded-2xl p-6 text-center">
              <Image
                src="/images/trangbidocquyen/image.png"
                alt="Equipment"
                width={40}
                height={40}
                className="mx-auto mb-3 rounded-xl shadow-md border border-orange-500/40"
              />
              <div className="text-orange-200 text-sm mb-2 font-medium">
                Tổng số mảnh cần thiết
              </div>
              <div className="text-orange-400 text-5xl font-bold mb-2">
                {totalFragments}
              </div>
              <div className="text-orange-300 text-lg font-semibold">
                Mảnh trang bị độc quyền
              </div>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-purple-500/30 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Làm mới
          </button>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-xl p-5 shadow-lg">
          <div className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Bảng mảnh theo cấp độ
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-80 overflow-y-auto">
            {levels.slice(0, 20).map((level) => (
              <div
                key={level}
                className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20 hover:bg-blue-500/20 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Shield className={`w-3 h-3 ${getLevelColor(level)}`} />
                    <span className="text-white text-sm font-semibold">
                      {level}→{level + 1}
                    </span>
                  </div>
                  <span className="text-blue-200 text-sm font-bold">
                    {fragmentsRequired[level]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
