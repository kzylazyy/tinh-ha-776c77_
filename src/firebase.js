
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0b7UNYyFi-ypeltHzvueL9hZbNVrDa9E",
  authDomain: "tinhha77c677.firebaseapp.com",
  projectId: "tinhha77c677",
  storageBucket: "tinhha77c677.firebasestorage.app",
  messagingSenderId: "329851719221",
  appId: "1:329851719221:web:041f605c6acab37374ab7c",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
