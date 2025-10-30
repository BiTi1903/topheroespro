// ============================================
// TOP HEROES AUTO CLAIM SCRIPT
// Paste vào Console của: https://topheroes.store.kopglobal.com/vi
// ============================================

(async function() {
    console.log('🚀 Top Heroes Auto Claim Started!');
    console.log('═══════════════════════════════════════════\n');
    
    // ⚠️ Firebase Config - ĐÃ ĐƯỢC ĐIỀN SẴN
    const firebaseConfig = {
        apiKey: "AIzaSyAOYm-xBpCWXNfoGsQkOdSAq5mT-UdxCMU",
        authDomain: "topheroes-5f97d.firebaseapp.com",
        databaseURL: "https://topheroes-5f97d-default-rtdb.firebaseio.com",
        projectId: "topheroes-5f97d",
        storageBucket: "topheroes-5f97d.appspot.com",
        messagingSenderId: "846690816103",
        appId: "1:846690816103:web:baccf45a2e61235c65c4c2"
    };
    
    try {
        // Import Firebase từ CDN
        console.log('📦 Loading Firebase SDK...');
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getDatabase, ref, get, update } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js');
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        console.log('✅ Firebase connected!\n');
        
        // Get data from Firebase
        console.log('📡 Fetching data from Firebase...');
        
        const codeSnapshot = await get(ref(db, 'topheroes/currentCode'));
        const usersSnapshot = await get(ref(db, 'topheroes/users'));
        
        if (!codeSnapshot.exists()) {
            console.error('❌ Không có code nào!');
            alert('❌ Không có code nào! Vui lòng cập nhật code trước.');
            return;
        }
        
        if (!usersSnapshot.exists()) {
            console.error('❌ Không có user nào!');
            alert('❌ Không có user nào được đăng ký!');
            return;
        }
        
        const code = codeSnapshot.val().code;
        const usersData = usersSnapshot.val();
        const users = Object.values(usersData).filter((u) => !u.claimed);
        
        if (users.length === 0) {
            console.log('✅ Tất cả user đã nhận quà rồi!');
            alert('✅ Tất cả user đã nhận quà rồi!');
            return;
        }
        
        console.log(`\n🎁 Code: ${code}`);
        console.log(`👥 Có ${users.length} user cần claim`);
        console.log('═══════════════════════════════════════════\n');
        
        // Helper functions
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        const clickElement = (selector) => {
            const el = document.querySelector(selector);
            if (el) {
                el.click();
                return true;
            }
            return false;
        };
        
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
        async function processUser(user) {
            const uid = user.uid;
            console.log(`\n┌─────────────────────────────────────────┐`);
            console.log(`│ 👤 UID: ${uid.padEnd(33)}│`);
            console.log(`└─────────────────────────────────────────┘`);
            
            try {
                // Step 1: Click ĐĂNG NHẬP
                console.log('  1️⃣  Clicking login button...');
                const loginBtn = document.querySelector('[data-v-6664697b][data-v-ae79df4c]');
                if (loginBtn && loginBtn.textContent.includes('ĐĂNG NHẬP')) {
                    loginBtn.click();
                } else {
                    console.log('  ⚠️  Login button not found, might be already logged in');
                }
                await wait(1000);
                
                // Step 2: Fill UID
                console.log('  2️⃣  Filling UID...');
                if (!fillInput('input[placeholder*="Nhập UID"]', uid)) {
                    throw new Error('Cannot find UID input');
                }
                await wait(800);
                
                // Step 3: Click Check button
                console.log('  3️⃣  Clicking check button...');
                if (!clickElement('button.check-btn')) {
                    throw new Error('Cannot find check button');
                }
                await wait(800);
                
                // Step 4: Click Xác nhận (large button)
                console.log('  4️⃣  Clicking confirm button...');
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
                    throw new Error('Cannot find confirm button or button is disabled');
                }
                await wait(1500);
                
                // Step 5: Fill CODE
                console.log('  5️⃣  Filling code...');
                if (!fillInput('input[placeholder*="Nhập mã"]', code)) {
                    throw new Error('Cannot find code input');
                }
                await wait(800);
                
                // Step 6: Click Submit
                console.log('  6️⃣  Submitting...');
                const submitBtn = document.querySelector('button.submit-btn');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                } else {
                    throw new Error('Submit button not ready or disabled');
                }
                await wait(2000);
                
                // Step 7: Update Firebase
                console.log('  7️⃣  Updating Firebase...');
                await update(ref(db, `topheroes/users/${uid}`), {
                    claimed: true,
                    claimedAt: new Date().toISOString()
                });
                
                console.log('  ✅ SUCCESS!\n');
                return true;
                
            } catch (error) {
                console.error(`  ❌ ERROR: ${error.message}\n`);
                return false;
            }
        }
        
        // Process all users
        let success = 0;
        let failed = 0;
        const startTime = Date.now();
        
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            console.log(`\n📊 Progress: ${i + 1}/${users.length}`);
            
            const result = await processUser(user);
            if (result) {
                success++;
            } else {
                failed++;
            }
            
            // Wait between users (avoid rate limit)
            if (i < users.length - 1) {
                console.log('⏳ Waiting 3 seconds before next user...');
                await wait(3000);
            }
        }
        
        // Calculate duration
        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        
        // Summary
        console.log('\n\n═══════════════════════════════════════════');
        console.log('           📊 SUMMARY REPORT');
        console.log('═══════════════════════════════════════════');
        console.log(`✅ Success:  ${success}`);
        console.log(`❌ Failed:   ${failed}`);
        console.log(`📦 Total:    ${users.length}`);
        console.log(`⏱️  Duration: ${duration}s`);
        console.log('═══════════════════════════════════════════\n');
        
        // Show alert
        alert(`✅ Hoàn thành!\n\n` +
              `Thành công: ${success}\n` +
              `Thất bại: ${failed}\n` +
              `Tổng: ${users.length}\n` +
              `Thời gian: ${duration}s`);
        
    } catch (error) {
        console.error('💥 Fatal Error:', error);
        alert('❌ Lỗi: ' + error.message);
    }
})();