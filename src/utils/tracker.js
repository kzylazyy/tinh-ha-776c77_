// src/utils/tracker.js
import { db } from '../firebase.js';
import {
  collection,
  doc,
  increment,
  onSnapshot,
  setDoc
} from 'firebase/firestore';

let unsubscribeStats = null;

/**
 * Theo dõi thống kê mở prompt từ Firestore.
 * Mỗi document trong collection "characters" có ID là uid của nhân vật.
 */
export function startStatsListener(characters, onStatsUpdate = () => {}) {
  if (!db) {
    onStatsUpdate({ total: null, byCharacter: {} });
    return () => {};
  }

  if (unsubscribeStats) unsubscribeStats();

  unsubscribeStats = onSnapshot(
    collection(db, 'characters'),
    (snapshot) => {
      const byCharacter = {};
      let total = 0;
      snapshot.forEach((item) => {
        const opens = Number(item.data().opens) || 0;
        byCharacter[item.id] = opens;
        total += opens;
      });
      onStatsUpdate({ total, byCharacter });
    },
    (error) => {
      console.error('Không thể tải thống kê lượt mở:', error);
      onStatsUpdate({ total: null, byCharacter: {} });
    }
  );

  return unsubscribeStats;
}

/** Ghi nhận đúng một lượt khi người dùng mở prompt. */
window.trackOpen = async function(uid) {
  if (!uid || !db) {
    if (!db) console.warn('Chưa kết nối Firebase: lượt mở chưa được lưu.');
    return;
  }

  try {
    // setDoc + increment tạo document nếu chưa tồn tại và cộng nguyên tử nếu đã có.
    await setDoc(doc(db, 'characters', uid), { opens: increment(1) }, { merge: true });
  } catch (error) {
    console.error('Không thể ghi nhận lượt mở:', error);
  }
};

// Sao chép đường dẫn trang nhân vật; thao tác này không cộng lượt mở prompt.
window.copyPrompt = async function(uid) {
  const url = `${window.location.origin}${window.location.pathname}?char=${encodeURIComponent(uid)}`;
  try {
    await navigator.clipboard.writeText(url);
    console.info(`Đã sao chép liên kết nhân vật: ${uid}`);
  } catch (error) {
    console.error('Không thể sao chép:', error);
  }
};
