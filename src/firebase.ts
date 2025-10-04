import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOYm-xBpCWXNfoGsQkOdSAq5mT-UdxCMU",
  authDomain: "topheroes-5f97d.firebaseapp.com",
  projectId: "topheroes-5f97d",
  storageBucket: "topheroes-5f97d.appspot.com",   // ✅ sửa lại đây
  messagingSenderId: "846690816103",
  appId: "1:846690816103:web:baccf45a2e61235c65c4c2",
  measurementId: "G-B963P535XP"
};

// Tránh initialize nhiều lần
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics chỉ chạy khi có window
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : undefined;
