// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXPULHFm40skCTdEYtMslKzwCwGp3Fcw",
  authDomain: "rpg-game-5ad55.firebaseapp.com",
  databaseURL:
    "https://rpg-game-5ad55-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rpg-game-5ad55",
  storageBucket: "rpg-game-5ad55.appspot.com",
  messagingSenderId: "194267660168",
  appId: "1:194267660168:web:9a12abbd8aed1658d6c43d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
