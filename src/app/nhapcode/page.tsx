"use client";
import React, { useState, useEffect } from 'react';
import { Gift, Database, Send, CheckCircle, AlertCircle, Users, Zap, Play, Code } from 'lucide-react';

export default function TopHeroesAutoCode() {
  const [uid, setUid] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<Array<{
    uid: string;
    registeredAt: string;
    claimed: boolean;
    claimedAt?: string;
  }>>([]);
  const [status, setStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLog, setProcessLog] = useState<string[]>([]);

  // Load data from memory
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('topheroes_data') || '{}');
    setRegisteredUsers(saved.users || []);
    setCurrentCode(saved.currentCode || '');
  }, []);

  // Save to memory
  const saveData = (users: Array<{
    uid: string;
    registeredAt: string;
    claimed: boolean;
    claimedAt?: string;
  }>, code: string) => {
    const data = {
      users: users,
      currentCode: code,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('topheroes_data', JSON.stringify(data));
  };

  // User: Register UID
  const handleRegisterUID = () => {
    if (!uid.trim()) {
      setStatus('❌ Vui lòng nhập UID');
      return;
    }

    const exists = registeredUsers.find(u => u.uid === uid);
    if (exists) {
      setStatus('⚠️ UID này đã được đăng ký!');
      return;
    }

    const newUsers = [...registeredUsers, {
      uid: uid,
      registeredAt: new Date().toISOString(),
      claimed: false
    }];
    
    setRegisteredUsers(newUsers);
    saveData(newUsers, currentCode);
    setStatus('✅ Đăng ký thành công! Admin sẽ tự động gửi quà khi có code mới.');
    setUid('');
  };

  // Admin: Update code
  const handleUpdateCode = () => {
    if (!currentCode.trim()) {
      setStatus('❌ Vui lòng nhập code');
      return;
    }

    // Reset all claimed status when new code arrives
    const updatedUsers = registeredUsers.map(u => ({...u, claimed: false}));
    setRegisteredUsers(updatedUsers);
    saveData(updatedUsers, currentCode);
    
    setStatus(`✅ Đã cập nhật code mới: ${currentCode}. Bây giờ có thể chạy Auto Claim!`);
  };

  // Admin: Auto claim for all users
  const handleAutoClaimAll = () => {
    if (!currentCode) {
      setStatus('❌ Chưa có code!');
      return;
    }

    const unclaimedUsers = registeredUsers.filter(u => !u.claimed);
    if (unclaimedUsers.length === 0) {
      setStatus('✅ Tất cả user đã nhận quà rồi!');
      return;
    }

    setIsProcessing(true);
    setProcessLog([]);
    setStatus(`🚀 Bắt đầu claim cho ${unclaimedUsers.length} user...`);

    // Save list to localStorage for script to read
    localStorage.setItem('topheroes_auto_claim_queue', JSON.stringify({
      users: unclaimedUsers.map(u => u.uid),
      code: currentCode,
      currentIndex: 0
    }));

    // Open web global
    window.open('https://topheroes.store.kopglobal.com/vi', '_blank');
    
    setTimeout(() => {
      setIsProcessing(false);
      setStatus('✅ Đã mở web global. Vui lòng chạy Console Script hoặc Extension để tự động claim!');
    }, 2000);
  };

  // Copy console script
  const copyConsoleScript = () => {
    const script = `// TOP HEROES AUTO CLAIM SCRIPT
// Paste vào Console của trang https://topheroes.store.kopglobal.com/vi

(async function() {
    console.log('🚀 Top Heroes Auto Claim Started!');
    
    // Get queue from localStorage
    const queue = JSON.parse(localStorage.getItem('topheroes_auto_claim_queue') || '{}');
    if (!queue.users || queue.users.length === 0) {
        alert('❌ Không có user nào cần claim! Vui lòng cập nhật code trước.');
        return;
    }
    
    const { users, code } = queue;
    console.log(\`📋 Có \${users.length} user cần claim\`);
    
    // Helper function to wait
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Helper function to click element
    const clickElement = (selector) => {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            return true;
        }
        return false;
    };
    
    // Helper function to fill input
    const fillInput = (selector, value) => {
        const el = document.querySelector(selector);
        if (el) {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    };
    
    // Process one user
    async function processUser(uid) {
        console.log(\`\\n👤 Processing UID: \${uid}\`);
        
        try {
            // Step 1: Click ĐĂNG NHẬP
            console.log('1️⃣ Clicking login...');
            const loginBtn = document.querySelector('[data-v-6664697b][data-v-ae79df4c]');
            if (loginBtn && loginBtn.textContent.includes('ĐĂNG NHẬP')) {
                loginBtn.click();
            }
            await wait(1000);
            
            // Step 2: Fill UID
            console.log('2️⃣ Filling UID...');
            if (!fillInput('input[placeholder*="Nhập UID"]', uid)) {
                throw new Error('Cannot find UID input');
            }
            await wait(800);
            
            // Step 3: Click Check button
            console.log('3️⃣ Clicking check...');
            if (!clickElement('button.check-btn')) {
                throw new Error('Cannot find check button');
            }
            await wait(800);
            
            // Step 4: Click Xác nhận (large button)
            console.log('4️⃣ Clicking confirm...');
            const confirmBtns = document.querySelectorAll('button.site-button-large');
            let confirmed = false;
            for (let btn of confirmBtns) {
                if (btn.textContent.includes('Xác nhận') && !btn.disabled) {
                    btn.click();
                    confirmed = true;
                    break;
                }
            }
            if (!confirmed) {
                throw new Error('Cannot find confirm button');
            }
            await wait(1500);
            
            // Step 5: Fill CODE
            console.log('5️⃣ Filling code...');
            if (!fillInput('input[placeholder*="Nhập mã"]', code)) {
                throw new Error('Cannot find code input');
            }
            await wait(800);
            
            // Step 6: Click Submit
            console.log('6️⃣ Submitting...');
            const submitBtn = document.querySelector('button.submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            } else {
                throw new Error('Submit button not ready');
            }
            await wait(2000);
            
            console.log(\`✅ Success for UID: \${uid}\`);
            return true;
            
        } catch (error) {
            console.error(\`❌ Error for UID \${uid}:\`, error.message);
            return false;
        }
    }
    
    // Process all users
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < users.length; i++) {
        const uid = users[i];
        console.log(\`\\n📊 Progress: \${i + 1}/\${users.length}\`);
        
        const result = await processUser(uid);
        if (result) {
            success++;
        } else {
            failed++;
        }
        
        // Wait between users
        if (i < users.length - 1) {
            console.log('⏳ Waiting 3s before next user...');
            await wait(3000);
        }
    }
    
    // Summary
    console.log(\`\\n\\n📊 SUMMARY:\`);
    console.log(\`✅ Success: \${success}\`);
    console.log(\`❌ Failed: \${failed}\`);
    console.log(\`📦 Total: \${users.length}\`);
    
    alert(\`✅ Hoàn thành!\\n\\nThành công: \${success}\\nThất bại: \${failed}\\nTổng: \${users.length}\`);
    
    // Clear queue
    localStorage.removeItem('topheroes_auto_claim_queue');
    
})();`;

    navigator.clipboard.writeText(script);
    setStatus('✅ Đã copy Console Script! Paste vào Console của trang web global.');
  };

  // Copy Chrome Extension manifest
  const copyExtensionCode = () => {
    const manifest = `// FILE: manifest.json
{
  "manifest_version": 3,
  "name": "Top Heroes Auto Claim",
  "version": "1.0",
  "description": "Tự động claim code cho Top Heroes",
  "permissions": ["storage", "activeTab"],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [{
    "matches": ["https://topheroes.store.kopglobal.com/*"],
    "js": ["content.js"]
  }]
}

// FILE: popup.html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 20px; font-family: Arial; }
    button { width: 100%; padding: 10px; margin: 5px 0; cursor: pointer; }
    .success { background: #4CAF50; color: white; border: none; }
    .primary { background: #2196F3; color: white; border: none; }
  </style>
</head>
<body>
  <h3>Top Heroes Auto Claim</h3>
  <button class="primary" id="startBtn">🚀 Bắt đầu Auto Claim</button>
  <div id="status"></div>
  <script src="popup.js"></script>
</body>
</html>

// FILE: popup.js
document.getElementById('startBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: 'START_AUTO_CLAIM' });
});

// FILE: content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_AUTO_CLAIM') {
    startAutoClaim();
  }
});

async function startAutoClaim() {
  // Same logic as console script above
  // ... (copy từ console script)
}`;

    navigator.clipboard.writeText(manifest);
    setStatus('✅ Đã copy Extension code! Tạo folder mới và paste các file.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gift className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">Top Heroes Auto Claim System</h1>
          </div>
          <p className="text-blue-200">User chỉ nhập UID - Admin tự động claim hàng loạt!</p>
        </div>

        {/* Admin Toggle */}
        <div className="text-center mb-6">
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-bold"
          >
            {isAdmin ? '👤 Chế độ User' : '🔧 Chế độ Admin'}
          </button>
        </div>

        {/* Status Message */}
        {status && (
          <div className="mb-6 p-4 bg-blue-900/50 border border-blue-400 rounded-lg text-white backdrop-blur-sm">
            {status}
          </div>
        )}

        {/* Admin Panel */}
        {isAdmin && (
          <>
            <div className="bg-red-900/30 border-2 border-red-500 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Admin Control Panel</h2>
              </div>
              
              <div className="space-y-4">
                {/* Update Code */}
                <div>
                  <label className="block text-white mb-2 font-bold">1️⃣ Nhập Code Mới từ Discord:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      placeholder="Ví dụ: TOPHEROES2024"
                      className="flex-1 px-4 py-3 bg-gray-900 border-2 border-red-400 rounded-lg text-white text-lg"
                    />
                    <button
                      onClick={handleUpdateCode}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-bold"
                    >
                      <Send className="w-5 h-5" />
                      Cập Nhật
                    </button>
                  </div>
                </div>

                {/* Auto Claim Button */}
                {currentCode && (
                  <div className="bg-green-900/30 border-2 border-green-400 rounded-lg p-4">
                    <label className="block text-white mb-3 font-bold">2️⃣ Tự Động Claim Cho Tất Cả User:</label>
                    <button
                      onClick={handleAutoClaimAll}
                      disabled={isProcessing || registeredUsers.filter(u => !u.claimed).length === 0}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-6 h-6" />
                      {isProcessing ? 'Đang xử lý...' : `Claim cho ${registeredUsers.filter(u => !u.claimed).length} user`}
                    </button>
                  </div>
                )}

                {/* Statistics */}
                <div className="bg-gray-900/70 rounded-lg p-4 border border-gray-700">
                  <p className="text-white mb-3 font-bold flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Thống kê:
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-900/50 rounded p-3">
                      <p className="text-3xl font-bold text-blue-400">{registeredUsers.length}</p>
                      <p className="text-blue-300 text-sm">Tổng User</p>
                    </div>
                    <div className="bg-green-900/50 rounded p-3">
                      <p className="text-3xl font-bold text-green-400">{registeredUsers.filter(u => u.claimed).length}</p>
                      <p className="text-green-300 text-sm">Đã Nhận</p>
                    </div>
                    <div className="bg-yellow-900/50 rounded p-3">
                      <p className="text-3xl font-bold text-yellow-400">{registeredUsers.filter(u => !u.claimed).length}</p>
                      <p className="text-yellow-300 text-sm">Chưa Nhận</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Script Tools */}
            <div className="bg-purple-900/30 border-2 border-purple-400 rounded-xl p-6 mb-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code className="w-6 h-6" />
                3️⃣ Tools Tự Động (Chọn 1 trong 2)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Console Script */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-2">Option 1: Console Script (Dễ nhất)</h4>
                  <p className="text-gray-300 text-sm mb-3">Click "Auto Claim" → Mở web global → F12 → Console → Paste script</p>
                  <button
                    onClick={copyConsoleScript}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-bold"
                  >
                    <Code className="w-5 h-5" />
                    Copy Console Script
                  </button>
                </div>

                {/* Chrome Extension */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-white font-bold mb-2">Option 2: Chrome Extension (Pro)</h4>
                  <p className="text-gray-300 text-sm mb-3">Tạo extension riêng, chạy mượt mà hơn</p>
                  <button
                    onClick={copyExtensionCode}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 font-bold"
                  >
                    <Zap className="w-5 h-5" />
                    Copy Extension Code
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* User Panel */}
        {!isAdmin && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border-2 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              🎮 Đăng Ký Nhận Code Tự Động
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-bold">Nhập UID của bạn (1 lần duy nhất):</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    placeholder="Nhập User ID trong game"
                    className="flex-1 px-4 py-3 bg-gray-900 border-2 border-blue-400 rounded-lg text-white text-lg"
                  />
                  <button
                    onClick={handleRegisterUID}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-bold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Đăng Ký
                  </button>
                </div>
              </div>

              {currentCode ? (
                <div className="bg-green-900/30 border-2 border-green-400 rounded-lg p-4">
                  <p className="text-green-300 font-bold text-lg">
                    🎁 Code hiện tại: <span className="text-yellow-400">{currentCode}</span>
                  </p>
                  <p className="text-green-200 text-sm mt-2">Admin sẽ tự động gửi quà cho bạn!</p>
                </div>
              ) : (
                <div className="bg-yellow-900/30 border-2 border-yellow-400 rounded-lg p-4">
                  <p className="text-yellow-300 font-bold">⏳ Chưa có code mới. Vui lòng đợi admin cập nhật!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registered Users List */}
        {registeredUsers.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 border-white/20 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {isAdmin ? '👥 Danh Sách Người Dùng' : '🎁 Trạng Thái Của Bạn'}
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {registeredUsers.map((user, idx) => (
                <div key={idx} className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between border border-gray-700 hover:border-blue-500 transition">
                  <div>
                    <p className="text-white font-bold text-lg">UID: {user.uid}</p>
                    <p className="text-blue-300 text-sm">
                      📅 Đăng ký: {new Date(user.registeredAt).toLocaleString('vi-VN')}
                    </p>
                    {user.claimed && user.claimedAt && (
                      <p className="text-green-300 text-sm">
                        ✅ Đã nhận: {new Date(user.claimedAt).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user.claimed ? (
                      <span className="flex items-center gap-2 text-green-400 font-bold px-4 py-2 bg-green-900/30 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        Đã Nhận
                      </span>
                    ) : currentCode ? (
                      <span className="flex items-center gap-2 text-yellow-400 font-bold px-4 py-2 bg-yellow-900/30 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        Chờ Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-400 font-bold px-4 py-2 bg-gray-900/30 rounded-lg">
                        <AlertCircle className="w-5 h-5" />
                        Chờ Code
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-900/30 border-2 border-blue-400 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-3">📖 Hướng Dẫn Sử Dụng</h3>
          <div className="text-blue-200 space-y-3">
            <div>
              <p className="font-bold text-white mb-2">👤 Cho User:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Nhập UID của bạn và click "Đăng Ký" (chỉ 1 lần duy nhất)</li>
                <li>Chờ admin cập nhật code mới từ Discord</li>
                <li>Admin sẽ TỰ ĐỘNG gửi quà cho bạn - Không cần làm gì thêm!</li>
              </ol>
            </div>
            
            <div>
              <p className="font-bold text-white mb-2 mt-4">🔧 Cho Admin:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Chuyển sang chế độ Admin</li>
                <li>Lấy code mới từ Discord → Paste vào → Click "Cập Nhật"</li>
                <li>Click nút "Claim cho X user" → Web sẽ tự mở</li>
                <li>Nhấn F12 → Console → Paste script đã copy → Enter</li>
                <li>Ngồi xem script tự động claim hết!</li>
              </ol>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-400 rounded-lg p-4 mt-4">
              <p className="font-bold text-yellow-300">💡 Mẹo:</p>
              <p className="text-yellow-200 text-sm">Script sẽ tự động claim cho TẤT CẢ user còn lại. Bạn có thể làm việc khác trong lúc đó!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}