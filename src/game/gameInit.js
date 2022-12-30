import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { auth, playersRef } from "../config/firebase.js";
import { getGamePage } from "../app.js";
import { Overworld } from "./Overworld.js";
// import { convertCollision } from "./utils/convertCollision.js";
import { playerState } from "./PlayerState.js";
import { utils } from "./utils/utils.js";

// Temporary fn, need to split onAuth
export function init(user) {
  const overworld = new Overworld({
    element: document.querySelector(".game-page"),
  });
  playerState.getPlayerData(user, () => {
    // console.log("2 - gameinit");
    overworld.init();
    getGamePage();
  });
}

(function () {
  // for creating game, login all time
  // const testEmail = 'x@x.pl';
  // const testPass = '123456';
  // signInWithEmailAndPassword(auth, testEmail, testPass)
  // .then((u) => {
  //   init(u.user)
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  // });

  // --------------

  // follow auth change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user);
      // console.log("onAuthStateChanged login");
      // getGamePage();

      // console.log(window.OverworldMaps);
      // init(user);
    } else {
      // console.log("onAuthStateChanged not login");
    }
  });

  onValue(playersRef, (snapshot) => {
    // console.log(snapshot.val());
    // console.log("playerstate", playerState);
    const players = snapshot.val();
    console.log(playerState.name)
    console.log(window.OverworldMaps.outsideMap.configObjects);
    Object.values(players).forEach((player) => {
      // console.log("player", player);
      if (!player.online) return;
      if (
        player.currentMap === playerState.currentMap &&
        player.name !== playerState.name
      ) {
        window.OverworldMaps[player.currentMap].configObjects[player.name] = {
          type: "Person",
          x: utils.withGrid(player.x),
          y: utils.withGrid(player.y),
          src: "src/game/assets/characters/hero2.png",
          // behaviorLoop: [
          //   {type: "walk", direction: "down"}
          // ]
        };
      }
      
    });
  });

  // overworld.init();
  // convertCollision(); // convert map collision
})();
