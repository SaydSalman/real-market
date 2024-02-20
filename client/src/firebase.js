// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-5e5db.firebaseapp.com",
  projectId: "mern-estate-5e5db",
  storageBucket: "mern-estate-5e5db.appspot.com",
  messagingSenderId: "690023652271",
  appId: "1:690023652271:web:03a7f609050f65676f2d5a"
};

// // Initialize Firebase
export const app = initializeApp(firebaseConfig);