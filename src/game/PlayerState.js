import {
  child,
  get,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { dbRef } from "../config/firebase.js";
import { utils } from "./utils/utils.js";

class PlayerState {
  constructor() {
    this.name = null;
    this.storyFlags = {
      // "do-somethig": true
      something_to_do: true,
    };
  }

  async update(userData, resolve) {
    const myId = userData.uid;

    await get(child(dbRef, "players"))
      .then((snapshot) => {
        if (!snapshot.exists()) return;
        snapshot.forEach((user) => {
          const userData = user.val();
          if (userData.id === myId) {
            console.log(userData);
            this.name = userData.name;
            window.OverworldMaps[userData.currentMap].configObjects[userData.name] = {
                type: "Person",
                isPlayerControlled: true,
                x: utils.withGrid(userData.x),
                y: utils.withGrid(userData.y),
                src: "src/game/assets/characters/hero2.png",
              }
          }
        });
      })
      .catch((error) => {
        console.log("Update user player state error:", error);
      });

    resolve();
  }


}

export const playerState = new PlayerState();
