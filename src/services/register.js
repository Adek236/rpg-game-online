import {
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth, db, dbRef } from "../config/firebase.js";
import { getGamePage, registerAuthErr } from "../app.js";
import { init } from "../game/gameInit.js";
import { playerState } from "../game/PlayerState.js";

export async function registerUser() {
  const nickname = document.getElementById("registerNickname").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (nickname === "") return registerAuthErr("nickname-empty");

  let nicknameIsUsed = false;
  await get(child(dbRef, "players"))
    .then((snapshot) => {
      if (!snapshot.exists()) return;
      snapshot.forEach((user) => {
        const userNickname = user.val().name;
        if (userNickname === nickname) {
          registerAuthErr("nickname-is-used");
          nicknameIsUsed = true;
        }
      });

      // const a = Object.values(snapshot.val());
      // console.log(a)
      // for (const userNickname in a) {
      //   if (userNickname.name === nickname){
      //     registerAuthErr("nickname-is-used");
      //     things = false;
      //     break;
      //   }
      // }
    })
    .catch((error) => {
      console.log("Check nickname error:", error);
    });

  if (nicknameIsUsed) return registerAuthErr("nickname-is-used");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // console.log("user created");
      addPlayerDataToDB({ user, nickname }, ()=>{
        console.log("register 5")
        console.log("regis player ", playerState)
        init(user);
        // getGamePage();
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      // console.log(errorCode);
      // console.log(errorMessage);

      registerAuthErr(errorCode);
    });
}

async function addPlayerDataToDB(data, resolve) {
  const playerId = data.user.uid;

  await get(child(dbRef, `players/${playerId}`))
    .then((snapshot) => {
      if (snapshot.exists()) return;
      const playerRef = ref(db, `players/${playerId}`);
      set(playerRef, {
        id: playerId,
        name: data.nickname,
        x: 9,
        y: 4,
        currentMap: "outsideMap",
        online: false,
        outfit: "src/game/assets/characters/hero2.png"
      });
      // console.log("data added");
    })
    .catch((error) => {
      console.error(error);
    });
    resolve();
}
