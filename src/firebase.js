// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Điền đầy đủ Firebase Web App config lấy từ Firebase Console.
// Không đưa service-account key hoặc private key vào mã nguồn frontend.
const firebaseConfig = {
  apiKey: "ĐIỀN_API_KEY",
  authDomain: "tinh-ha-776c77.firebaseapp.com",
  projectId: "tinh-ha-776c77",
  storageBucket: "tinh-ha-776c77.appspot.com",
  messagingSenderId: "ĐIỀN_SENDER_ID",
  appId: "ĐIỀN_APP_ID"
};

const hasValidConfig =
  firebaseConfig.apiKey !== "ĐIỀN_API_KEY" &&
  firebaseConfig.messagingSenderId !== "ĐIỀN_SENDER_ID" &&
  firebaseConfig.appId !== "ĐIỀN_APP_ID";

let db = null;
if (hasValidConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.info("✦ Firebase đã được khởi tạo.");
  } catch (error) {
    console.error("Không thể khởi tạo Firebase:", error);
  }
} else {
  console.warn("✦ Firebase chưa có đủ Web App config. Thống kê sẽ chưa hoạt động.");
}

export { db };
