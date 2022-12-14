import {
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth, dbRef } from "../config/firebase.js";
import { getGamePage } from "../app-ui.js";

export function registerUser() {
  // TODO: if nickname is empty do error
  const nickname = document.getElementById("registerNickname").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      console.log("user created");
      addPlayerDataToDB({ user, nickname });
      getGamePage();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(errorCode);
      console.log(errorMessage);
    });
}

function addPlayerDataToDB(data) {
  const playerId = data.user.uid;

  get(child(dbRef, `players/${playerId}`))
    .then((snapshot) => {
      if (snapshot.exists()) return;

      const playerRef = ref(db, `players/${playerId}`);
      set(playerRef, {
        id: playerId,
        name: data.nickname,
      });
      console.log("data added");
    })
    .catch((error) => {
      console.error(error);
    });
}
