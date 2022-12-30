import {
  child,
  get,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { dbRef } from "../config/firebase.js";
import { utils } from "./utils/utils.js";
import { db } from "../config/firebase.js";

class PlayerState {
  constructor() {
    this.name = null;
    this.id = null;
    this.storyFlags = {
      // "do-somethig": true
      something_to_do: true,
    };
  }

  get playerRef() {
    return ref(db, `players/${this.id}`);
  }

  async getPlayerData(userData, resolve) {
    const myId = userData.uid;
    // console.log("myId ", myId )
    await get(child(dbRef, "players"))
    .then((snapshot) => {
      if (!snapshot.exists()) return;
      snapshot.forEach((user) => {
        const userData = user.val();
        // console.log("userData ", userData.id )
        if (userData.id === myId) {
          // console.log("userdata=", userData);
          this.name = userData.name;
            this.id = userData.id;
            this.currentMap = userData.currentMap;
            window.OverworldMaps[userData.currentMap].configObjects[
              userData.name
            ] = {
              type: "Person",
              isPlayerControlled: true,
              x: utils.withGrid(userData.x),
              y: utils.withGrid(userData.y),
              src: "src/game/assets/characters/hero2.png",
            };
            // console.log("1 - playerState getPlayerData")
            this.setPlayerOnline();
          } 
        });
      })
      .catch((error) => {
        console.log("Update user player state error:", error);
      });

    resolve();
  }

  updatePlayer(state) {
    // console.log(state.player)
    update(this.playerRef, state.player);
  }

  setPlayerOnline() {
    update(this.playerRef, { online: true });
  }

  setPlayerOffline(){
    update(this.playerRef, {online: false})
  }
}

export const playerState = new PlayerState();
