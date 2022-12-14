import {
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "../config/firebase.js";
import { getGamePage, loginAuthErr } from "../app.js";
import { init } from "../game/gameInit.js";

export function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((u) => {
        // console.log("login 4")
        // console.log(u)
        // Signed in
        // const user = userCredential.user;
        // console.log("usss", user);
        // getGamePage();
        init(u.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        // console.log(errorCode);
        // console.log(errorMessage);
        loginAuthErr(errorCode);
      });
  }