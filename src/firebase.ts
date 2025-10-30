import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  update,
  DataSnapshot,
  DatabaseReference,
} from "firebase/database";

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
// 🧩 Kiểu dữ liệu
// ======================
interface FirebaseUser {
  uid: string;
  registeredAt: string;
  claimed: boolean;
  claimedAt?: string;
}

interface FirebaseCode {
  code: string;
  updatedAt: string;
}

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
      uid,
      registeredAt: new Date().toISOString(),
      claimed: false,
    } satisfies FirebaseUser);

    console.log("✅ Đã lưu UID:", uid);
  },

  // 📦 Lấy danh sách user
  async getUsers(): Promise<FirebaseUser[]> {
    const usersRef = ref(database, "topheroes/users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, FirebaseUser>;
      return Object.values(data);
    }
    return [];
  },

  // 🎁 Cập nhật code mới
  async updateCode(code: string) {
    const codeRef = ref(database, "topheroes/currentCode");
    await set(codeRef, {
      code,
      updatedAt: new Date().toISOString(),
    } satisfies FirebaseCode);

    // Reset trạng thái claimed cho tất cả users
    const usersRef = ref(database, "topheroes/users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val() as Record<string, FirebaseUser>;
      const updates: Record<string, boolean> = {};
      Object.keys(users).forEach((uid) => {
        updates[`topheroes/users/${uid}/claimed`] = false;
      });
      await update(ref(database), updates);
    }

    console.log("✅ Đã cập nhật code:", code);
  },

  // 🔍 Lấy code hiện tại
  async getCurrentCode(): Promise<string> {
    const codeRef = ref(database, "topheroes/currentCode");
    const snapshot = await get(codeRef);
    if (snapshot.exists()) {
      return (snapshot.val() as FirebaseCode).code;
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
  onUsersChange(callback: (users: FirebaseUser[]) => void) {
    const usersRef = ref(database, "topheroes/users");
    return onValue(usersRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, FirebaseUser>;
        callback(Object.values(data));
      } else {
        callback([]);
      }
    });
  },

  // 🕒 Lắng nghe thay đổi code (Realtime)
  onCodeChange(callback: (code: string) => void) {
    const codeRef = ref(database, "topheroes/currentCode");
    return onValue(codeRef, (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as FirebaseCode;
        callback(data.code);
      } else {
        callback("");
      }
    });
  },
};

// ======================
// 🧩 Hàm tiện ích trực tiếp
// ======================
export async function saveUser(uid: string) {
  const userRef = ref(database, `topheroes/users/${uid}`);
  await set(userRef, {
    uid,
    registeredAt: new Date().toISOString(),
    claimed: false,
  } satisfies FirebaseUser);
}

export async function saveCurrentCode(code: string) {
  const codeRef = ref(database, "topheroes/currentCode");
  await set(codeRef, {
    code,
    updatedAt: new Date().toISOString(),
  } satisfies FirebaseCode);
}
