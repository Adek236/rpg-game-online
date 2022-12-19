import {
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "../config/firebase.js";
import { getGamePage, loginAuthErr } from "../app.js";

export function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        // const user = userCredential.user;
        // console.log("singed in");
        getGamePage();
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