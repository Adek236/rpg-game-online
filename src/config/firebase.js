import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {
  ref,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const dbRef = ref(db);
const playersRef = ref(db, "players");

export { auth, db, dbRef, playersRef };
