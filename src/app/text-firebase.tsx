"use client";
import { useEffect } from "react";
import { ref, set } from "firebase/database";
import { database } from "@/firebase";

export default function TestFirebase() {
  useEffect(() => {
    const userRef = ref(database, "topheroes/testUser");
    set(userRef, {
      uid: "test123",
      time: new Date().toISOString(),
    })
      .then(() => console.log("✅ Lưu thành công"))
      .catch((err) => console.error("❌ Lỗi lưu:", err));
  }, []);

  return <div>Testing Firebase…</div>;
}
