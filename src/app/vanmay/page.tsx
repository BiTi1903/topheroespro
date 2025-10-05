"use client";
import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Trophy, Box, X } from 'lucide-react';

interface ChestItem {
  name: string;
  rate: number;
}

interface Chest {
  name: string;
  color: string;
  icon: string;
  items: ChestItem[];
}

interface ResultItem {
  name: string;
  count: number;
  rate: number;
}

const ChestSimulator: React.FC = () => {
  const [selectedChest, setSelectedChest] = useState<'fortress' | 'silver' | 'gold'>('fortress');
  const [quantity, setQuantity] = useState<number>(10);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [specialEffect, setSpecialEffect] = useState<'fireworks' | 'sad' | null>(null);
  const specialItems: Record<typeof selectedChest, string> = {
  gold: '9999 Kim Cương',
  silver: '999 Kim Cương',
  fortress: '999 vé',
};

const [isSpinning, setIsSpinning] = useState(false);


const specialItemName = specialItems[selectedChest];

  const chestData: Record<'fortress' | 'silver' | 'gold', Chest> = {
    fortress: {
      name: 'Rương Skin Pháo Đài',
      color: 'from-purple-500 to-pink-500',
      icon: '🏰',
      items: [
        { name: '1 vé', rate: 7.69 },
        { name: '2 vé', rate: 9.62 },
        { name: '3 vé', rate: 11.54 },
        { name: '4 vé', rate: 13.46 },
        { name: '5 vé', rate: 15.38 },
        { name: '6 vé', rate: 13.46 },
        { name: '7 vé', rate: 11.54 },
        { name: '8 vé', rate: 9.62 },
        { name: '9 vé', rate: 7.96 },
        { name: '999 vé', rate: 0.01 },
        { name: 'Rương Rune 2', rate: 12.12 },
        { name: '10 Bảng Pha Lê Tím', rate: 12.12 },
        { name: '10 Kim Cương', rate: 25.25 },
        { name: '25 Sách Skill', rate: 25.25 },
        { name: '150 Rune Cường Hóa', rate: 25.25 }
      ]
    },
    silver: {
      name: 'Rương Bạc',
      color: 'from-gray-400 to-gray-600',
      icon: '🥈',
      items: [
        { name: '999 Kim Cương', rate: 0.18 },
        { name: 'Lệnh Chiêu Mộ', rate: 0.92 },
        { name: 'Mảnh Vạn Năng Anh Hùng Cam', rate: 0.46 },
        { name: 'Mảnh Vạn Năng Anh Hùng Tím', rate: 4.58 },
        { name: '1k Gỗ', rate: 6.87 },
        { name: '1k Đá', rate: 6.87 },
        { name: '1k Thịt', rate: 6.87 },
        { name: '2x 1k Gỗ', rate: 2.29 },
        { name: '2x 1k Đá', rate: 2.29 },
        { name: '2x 1k Thịt', rate: 2.29 },
        { name: '20 Bảng Pha Lê Tím', rate: 2.29 },
        { name: '50 Bảng Pha Lê Tím', rate: 2.29 },
        { name: '1 Bảng Pha Lê Tím', rate: 2.29 },
        { name: '2 Bảng Pha Lê Tím', rate: 2.29 },
        { name: '10 Sách Skill', rate: 13.74 },
        { name: '30 Sách Skill', rate: 6.87 },
        { name: 'Gia Tốc Huấn Luyện 5p', rate: 4.58 },
        { name: 'Gia Tốc Xây 5p', rate: 4.58 },
        { name: 'Gia Tốc 5p', rate: 4.48 },
        { name: 'Gia Tốc Nghiên Cứu 5p', rate: 4.58 },
        { name: '500 Rune Cường Hóa', rate: 4.58 },
        { name: '200 Rune Cường Hóa', rate: 4.58 },
        { name: '2000 Ruby', rate: 4.58 },
        { name: '10000 Ruby', rate: 4.58 }
      ]
    },
    gold: {
      name: 'Rương Vàng',
      color: 'from-yellow-400 to-yellow-600',
      icon: '🏆',
      items: [
        { name: 'Linh Vật Gấu', rate: 0.13 },
        { name: 'Linh Vật Đại Bàng', rate: 0.13 },
        { name: '9999 Kim Cương', rate: 0.13 },
        { name: 'Lệnh Chiêu Mộ', rate: 4.37 },
        { name: 'Rương Trang Trí Tím', rate: 2.18 },
        { name: '10k Gỗ', rate: 3.28 },
        { name: '10k Đá', rate: 3.28 },
        { name: '10k Thịt', rate: 3.28 },
        { name: '2x 10k Gỗ', rate: 1.09 },
        { name: '2x 10k Đá', rate: 1.09 },
        { name: '2x 10k Thịt', rate: 1.09 },
        { name: '5 Bảng Pha Lê Tím', rate: 0.66 },
        { name: '10 Bảng Pha Lê Tím', rate: 0.66 },
        { name: '200 Bảng Pha Lê Tím', rate: 0.66 },
        { name: '500 Bảng Pha Lê Tím', rate: 0.66 },
        { name: '30 Sách Skill', rate: 26.21 },
        { name: '100 Sách Skill', rate: 13.11 },
        { name: 'Gia Tốc Huấn Luyện 60p', rate: 4.37 },
        { name: 'Gia Tốc Xây Dựng 60p', rate: 4.37 },
        { name: 'Gia Tốc Nghiên Cứu 60p', rate: 4.37 },
        { name: 'Gia Tốc 60p', rate: 4.37 },
        { name: 'Thuốc 25 Năng Lượng', rate: 4.3 },
        { name: 'Vé Làm Mới Giao Dịch', rate: 0.87 },
        { name: '40 Rương Tự Chọn Tài Nguyên Lam', rate: 1.31 },
        { name: '80 Rương Tự Chọn Tài Nguyên Lam', rate: 1.31 },
        { name: '20 Rương Tự Chọn Tài Nguyên Tím', rate: 1.31 },
        { name: '2000 Rune Cường Hóa', rate: 2.84 },
        { name: '4000 Rune Cường Hóa', rate: 2.84 },
        { name: '100 Rune Cường Hóa', rate: 2.84 },
        { name: '500 Rune Cường Hóa', rate: 2.84 }
      ]
    }
  };

  const simulateOpening = () => {
  const chest = chestData[selectedChest];
  const itemCounts: Record<string, number> = {};
  const totalRate = chest.items.reduce((sum, item) => sum + item.rate, 0);

  // Sinh kết quả ngẫu nhiên
  for (let i = 0; i < quantity; i++) {
    const roll = Math.random() * totalRate;
    let cumulative = 0;
    for (const item of chest.items) {
      cumulative += item.rate;
      if (roll <= cumulative) {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
        break;
      }
    }
  }

  const finalResults: ResultItem[] = Object.entries(itemCounts).map(([name, count]) => ({
    name,
    count,
    rate: chest.items.find(i => i.name === name)?.rate || 0
  }));

  // Đưa vật phẩm hiếm lên đầu
  finalResults.sort((a, b) => {
    if (a.rate < 1 && b.rate >= 1) return -1;
    if (b.rate < 1 && a.rate >= 1) return 1;
    return b.count - a.count;
  });

  // ---- EFFECT: Quay rương trước khi hiện kết quả ----
  setShowModal(true);
  setResults([]); // reset hiển thị trước
  let index = 0;

  const rollInterval = setInterval(() => {
    setResults(finalResults.slice(0, index + 1)); // hiện dần kết quả
    index++;
    if (index >= finalResults.length) {
      clearInterval(rollInterval);
      if (itemCounts[specialItemName]) setSpecialEffect('fireworks');
      else setSpecialEffect('sad');
    }
  }, 200); // 150ms cho mỗi vật phẩm, tạo hiệu ứng quay
};



  const getRarityColor = (itemName: string, rate: number) => {
  const rareItems = [
    '9999 Kim Cương',
    'Linh Vật Gấu',
    'Linh Vật Đại Bàng',
    '999 Kim Cương',
    '999 vé'
  ];

  if (rareItems.includes(itemName)) return 'text-red-300 font-bold';
  if (rate < 5) return 'text-purple-400 font-semibold';
  if (rate < 15) return 'text-blue-400';
  return 'text-gray-300';
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <style>{`
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
  @keyframes blinkSlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
  .animate-blink-slow { animation: blinkSlow 1.5s infinite; }
  }

`}</style>


      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            Mô Phỏng Mở Rương
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </h1>
        </div>

        {/* Chest Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(chestData).map(([key, chest]) => (
            <button
              key={key}
              onClick={() => { setSelectedChest(key as 'fortress' | 'silver' | 'gold'); setShowModal(false); }}
              className={`relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:cursor-pointer ${
                selectedChest === key
                  ? `bg-gradient-to-br ${chest.color} shadow-2xl ring-4 ring-white`
                  : 'bg-gray-800 hover:bg-gray-700 shadow-lg'
              }`}
            >
              <div className="text-6xl mb-3">{chest.icon}</div>
              <h3 className="text-xl font-bold text-white">{chest.name}</h3>
              <p className="text-sm text-gray-300 mt-2">{chest?.items?.length || 0} vật phẩm</p>
              {selectedChest === key && (
                <div className="absolute top-2 right-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quantity Input */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-xl mb-4">
          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-32 px-4 py-2 bg-gray-700 text-white text-lg rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              min={1}
            />
            <div className="flex gap-2 flex-1">
              {[10, 50, 100, 500].map(num => (
                <button
                  key={num}
                  onClick={() => setQuantity(num)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={simulateOpening}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Mở Rương
            </button>
          </div>
        </div>

        {/* Modal Results */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl transform animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hiệu ứng đặc biệt */}
              

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Box className="w-7 h-7 text-yellow-400" />
                  Kết Quả Mở {quantity} Rương
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
  {results.map((item, index) => {
    const isSpecial = ['9999 Kim Cương','Linh Vật Gấu','Linh Vật Đại Bàng','999 Kim Cương','999 vé'].includes(item.name);
    return (
      <div
        key={index}
        className={`bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-all duration-200 border-2 border-purple-500/50 hover:border-purple-500 transform hover:scale-105 ${isSpecial ? 'animate-blink-slow' : ''}`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-sm font-semibold mb-1 ${getRarityColor(item.name, item.rate)} ${isSpecial ? 'text-red-300 font-bold' : ''}`}>
            {item.name}
          </h3>

          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            ×{item.count}
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          Tỉ lệ: {item.rate}%
        </div>
        <div className="text-gray-500 text-xs">
          Nhận: {((item.count / quantity) * 100).toFixed(1)}%
        </div>
      </div>
    )
  })}
</div>


              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Drop Rates Grid */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-xl mt-4">
          <h2 className="text-xl font-bold text-white mb-3">
            Tỉ Lệ Rơi: {chestData[selectedChest]?.name || ''}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {chestData[selectedChest]?.items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-3 hover:bg-gray-650 transition-all border-l-4"
                style={{ 
                  borderLeftColor: item.rate < 1 ? '#f87171' : 
                                  item.rate < 2 ? '#fb923c' : 
                                  item.rate < 5 ? '#fbbf24' : 
                                  item.rate < 10 ? '#c084fc' : 
                                  item.rate < 15 ? '#60a5fa' : '#4ade80'
                }}
              >
                <h3 className={`text-sm font-semibold mb-1 ${getRarityColor(item.name, item.rate)}`}>
  {item.name}
</h3>

                <div className="text-gray-300 text-lg font-bold">
                  {item.rate}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChestSimulator;