// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-43f1a.firebaseapp.com",
  projectId: "real-estate-43f1a",
  storageBucket: "real-estate-43f1a.appspot.com",
  messagingSenderId: "1073552174799",
  appId: "1:1073552174799:web:2aaa5eec5a0e128adb51ba",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
