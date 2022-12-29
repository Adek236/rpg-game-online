import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { auth, playersRef } from "../config/firebase.js";
import { getGamePage } from "../app.js";
import { Overworld } from "./Overworld.js";
import { convertCollision } from "./utils/convertCollision.js";
import { playerState } from "./PlayerState.js";

(function () {
  // for creating game, login all time
  // const testEmail = 'x@x.pl';
  // const testPass = '123456';
  // signInWithEmailAndPassword(auth, testEmail, testPass)
  // .then(() => {
  //   getGamePage();
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  // });

  // --------------

  // follow auth change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      console.log("onAuthStateChanged login");

      // console.log(window.OverworldMaps)

      playerState.getPlayerData(user, () => {
        console.log("2 - gameinit")
        overworld.init();
        getGamePage();
      });

    } else {
      console.log("onAuthStateChanged not login");
    }
  });

  // onValue(playersRef, (snapshot) => {
  //   console.log(snapshot.val());
  // });

  const overworld = new Overworld({
    element: document.querySelector(".game-page"),
  });

  // overworld.init();
  // convertCollision(); // convert map collision
})();
