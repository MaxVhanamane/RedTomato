// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6N6KiU8nA3tZ0RNb7YYCbHtqBPKserXo",
  authDomain: "red-tomato-fa33d.firebaseapp.com",
  projectId: "red-tomato-fa33d",
  storageBucket: "red-tomato-fa33d.appspot.com",
  messagingSenderId: "1031902392175",
  appId: "1:1031902392175:web:fd0490e05b0a434176029a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage =getStorage(app)
