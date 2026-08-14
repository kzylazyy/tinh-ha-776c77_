// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Thay thế nội dung trong ngoặc kép bằng Config thật của bạn sau này
const firebaseConfig = {
  apiKey: "ĐIỀN_KHI_CÓ_API_KEY",
  authDomain: "tinh-ha-776c77.firebaseapp.com",
  projectId: "tinh-ha-776c77",
  storageBucket: "tinh-ha-776c77.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

let app;
let db = null;

try {
  // Kiểm tra xem bạn đã điền key chưa. 
  // Nếu chưa, web vẫn chạy bằng dữ liệu tĩnh (.json) không báo lỗi.
  if (firebaseConfig.apiKey !== "ĐIỀN_KHI_CÓ_API_KEY") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✦ Đã kết nối với Tinh Hà (Firebase)");
  } else {
    console.warn("✦ Chưa kết nối Tinh Hà. Đang chạy dữ liệu tĩnh (Offline Archive).");
  }
} catch (error) {
  console.error("Lỗi đài quan sát (Khởi tạo Firebase thất bại):", error);
}

export { db };