// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD63_1HhxdsWz67MYy6zU0yYMrbhcCkfbs",
  authDomain: "macrozone-58f56.firebaseapp.com",
  projectId: "macrozone-58f56",
  storageBucket: "macrozone-58f56.firebasestorage.app",
  messagingSenderId: "26936016552",
  appId: "1:26936016552:web:c29bb0ca7ed616b173cc9d",
  measurementId: "G-E213VEWMHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
