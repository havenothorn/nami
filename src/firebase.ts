// Firebase 초기화 (환경변수 사용)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Vite 환경에서는 import.meta.env.VITE_* 형태로 노출됩니다.
const databaseURL =
  import.meta.env.VITE_FIREBASE_DATABASE_URL ||
  "https://namis-log-3b0d8-default-rtdb.firebaseio.com";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL,
};

const app = initializeApp(firebaseConfig as Record<string, any>);
const database = getDatabase(app, databaseURL);

// Analytics는 브라우저 환경에서만 초기화
let analytics = null as ReturnType<typeof getAnalytics> | null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // 측정이 이미 초기화되었거나 사용할 수 없는 환경일 수 있음
    analytics = null;
  }
}

export { app, analytics, database, firebaseConfig };
