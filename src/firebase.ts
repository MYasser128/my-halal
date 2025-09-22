import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCfq7aE9CsYjvTZzdJEWHxCJ0uKAHHn1w0",
    authDomain: "my-halal-4da5d.firebaseapp.com",
    projectId: "my-halal-4da5d",
    storageBucket: "my-halal-4da5d.firebasestorage.app",
    messagingSenderId: "8880332830",
    appId: "1:8880332830:web:5ac4cf0581fbffd4b74e0f",
    measurementId: "G-5LRK1LDPGY"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
