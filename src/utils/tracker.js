// src/utils/tracker.js
import { db } from '../firebase.js';
// Bạn cần cài đặt thư viện firebase: npm install firebase
import { doc, updateDoc, increment } from "firebase/firestore"; 

// 1. Ghi nhận lượt nhấp (Mở link)
window.trackClick = async function(charId) {
  try {
    // Nếu chưa cấu hình Firebase, chỉ in ra console
    if (!db) {
      console.log(`[Offline Mode] Đã nhấp vào vì sao: ${charId}`);
      return;
    }

    // Kết nối đến document của char đó trên Firebase và cộng thêm 1
    const charRef = doc(db, "characters", charId);
    await updateDoc(charRef, {
      likes: increment(1) // Bạn có thể dùng trường 'likes' hoặc 'clicks'
    });
    
    console.log(`Đã ghi nhận 1 tương tác cho vì sao: ${charId}`);
  } catch (error) {
    console.error("Nhiễu sóng tín hiệu (Lỗi Firebase):", error);
  }
};

// 2. Ghi nhận lượt Copy
window.copyPrompt = function(charId) {
  // Lấy link hiện tại và đính kèm ID nhân vật
  const url = window.location.origin + window.location.pathname + `?char=${charId}`;
  
  // Lưu vào Clipboard (bộ nhớ tạm) của người dùng
  navigator.clipboard.writeText(url).then(() => {
    // Thông báo cực kỳ nhỏ gọn, không dùng alert quá to
    console.log(`Đã sao chép tín hiệu vì sao: ${charId}`);
    
    // (Tùy chọn) Gọi hàm trackClick để tăng số đếm copy
    // trackClick(charId);
  }).catch(err => {
    console.error("Không thể sao chép:", err);
  });
};