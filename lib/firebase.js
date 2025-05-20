// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSWdtSpfwF9iW6sRwmmsxEZyJ6tYupBI0",
  authDomain: "svijet-serija.firebaseapp.com",
  projectId: "svijet-serija",
  storageBucket: "svijet-serija.firebasestorage.app",
  messagingSenderId: "87736694545",
  appId: "1:87736694545:web:7b4db4b6b25406678fbeb0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
