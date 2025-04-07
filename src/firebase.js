// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCeUfHgqmYTnFtvdo3JZEyalzkbIe0sBe4",
  authDomain: "webapp-2af5e.firebaseapp.com",
  projectId: "webapp-2af5e",
  storageBucket: "webapp-2af5e.firebasestorage.app",
  messagingSenderId: "201976852154",
  appId: "1:201976852154:web:464c9b630685c1f0f19c83"
};

const app = initializeApp(firebaseConfig);
// ✅ 這一行很重要！你一定要有這個匯出 Firestore 才能用
export const db = getFirestore(app);
export const auth = getAuth(app);
