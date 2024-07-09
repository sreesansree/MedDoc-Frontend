// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "docmed-81c9d.firebaseapp.com",
  projectId: "docmed-81c9d",
  storageBucket: "docmed-81c9d.appspot.com",
  messagingSenderId: "1020934450445",
  appId: "1:1020934450445:web:b58932a15ad22a82335444",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
