// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";

// ======================
// 🔥 Firebase Config
// ======================
const firebaseConfig = {
  apiKey: "AIzaSyAOYm-xBpCWXNfoGsQkOdSAq5mT-UdxCMU",
  authDomain: "topheroes-5f97d.firebaseapp.com",
  databaseURL: "https://topheroes-5f97d-default-rtdb.firebaseio.com",
  projectId: "topheroes-5f97d",
  storageBucket: "topheroes-5f97d.firebasestorage.app",
  messagingSenderId: "846690816103",
  appId: "1:846690816103:web:baccf45a2e61235c65c4c2",
  measurementId: "G-B963P535XP",
};

// ======================
// ⚙️ Initialize Firebase
// ======================
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;

// ======================
// 🧩 Helper Functions
// ======================
export const firebaseService = {
  // 🧭 Lưu UID người dùng mới
  async addUser(uid: string) {
    const userRef = ref(database, `topheroes/users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      console.warn("⚠️ UID đã tồn tại:", uid);
      return;
    }

    await set(userRef, {
      uid: uid,
      registeredAt: new Date().toISOString(),
      claimed: false,
    });

    console.log("✅ Đã lưu UID:", uid);
  },

  // 📦 Lấy danh sách user
  async getUsers() {
    const usersRef = ref(database, "topheroes/users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data);
    }
    return [];
  },

  // 🎁 Cập nhật code mới
  async updateCode(code: string) {
    const codeRef = ref(database, "topheroes/currentCode");
    await set(codeRef, {
      code: code,
      updatedAt: new Date().toISOString(),
    });

    // Reset trạng thái claimed cho tất cả users
    const usersRef = ref(database, "topheroes/users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const updates: any = {};
      Object.keys(users).forEach((uid) => {
        updates[`topheroes/users/${uid}/claimed`] = false;
      });
      await update(ref(database), updates);
    }

    console.log("✅ Đã cập nhật code:", code);
  },

  // 🔍 Lấy code hiện tại
  async getCurrentCode() {
    const codeRef = ref(database, "topheroes/currentCode");
    const snapshot = await get(codeRef);
    if (snapshot.exists()) {
      return snapshot.val().code;
    }
    return "";
  },

  // ✅ Đánh dấu user đã claim
  async markAsClaimed(uid: string) {
    const userRef = ref(database, `topheroes/users/${uid}`);
    await update(userRef, {
      claimed: true,
      claimedAt: new Date().toISOString(),
    });

    console.log("✅ Đã đánh dấu đã claim:", uid);
  },

  // 🕒 Lắng nghe thay đổi users (Realtime)
  onUsersChange(callback: (users: any[]) => void) {
    const usersRef = ref(database, "topheroes/users");
    return onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback(Object.values(data));
      } else {
        callback([]);
      }
    });
  },

  // 🕒 Lắng nghe thay đổi code (Realtime)
  onCodeChange(callback: (code: string) => void) {
    const codeRef = ref(database, "topheroes/currentCode");
    return onValue(codeRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val().code);
      } else {
        callback("");
      }
    });
  },
};

// ======================
// 🧩 Hàm tiện ích trực tiếp (nếu cần gọi ngoài firebaseService)
// ======================
export async function saveUser(uid: string) {
  const userRef = ref(database, `topheroes/users/${uid}`);
  await set(userRef, {
    uid: uid,
    registeredAt: new Date().toISOString(),
    claimed: false,
  });
}

export async function saveCurrentCode(code: string) {
  const codeRef = ref(database, "topheroes/currentCode");
  await set(codeRef, {
    code: code,
    updatedAt: new Date().toISOString(),
  });
}
