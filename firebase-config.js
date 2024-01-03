// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjpR1tmLjiyqNxPjWdpQnFYfCKbyMwD-w",
  authDomain: "annes-sandwich.firebaseapp.com",
  projectId: "annes-sandwich",
  storageBucket: "annes-sandwich.appspot.com",
  messagingSenderId: "698815311552",
  appId: "1:698815311552:web:39b522d289ff97429f4725",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_AUTH = getAuth(app);
export const FIREBASE_STORAGE = getStorage();
