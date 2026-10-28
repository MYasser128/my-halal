import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error React Native persistence exists at runtime but is missing from the default Firebase typings.
  getReactNativePersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyCfq7aE9CsYjvTZzdJEWHxCJ0uKAHHn1w0",
  authDomain: "my-halal-4da5d.firebaseapp.com",
  projectId: "my-halal-4da5d",
  storageBucket: "my-halal-4da5d.firebasestorage.app",
  messagingSenderId: "8880332830",
  appId: "1:8880332830:web:5ac4cf0581fbffd4b74e0f",
  measurementId: "G-5LRK1LDPGY",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch {
    // Fast Refresh reuses the Auth instance created on the first load.
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
