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
    this.currentMap = null;
    this.outfit = null;
    this.isShiftPressed = false;
    this.storyFlags = {
      something_to_do: true,
    };
  }

  get playerRef() {
    return ref(db, `players/${this.id}`);
  }

  async getPlayerData(userData, resolve) {
    let object;
    const myId = userData.uid;
    await get(child(dbRef, "players"))
      .then((snapshot) => {
        if (!snapshot.exists()) return;
        snapshot.forEach((user) => {
          const userData = user.val();
          if (userData.id === myId) {
            this.name = userData.name;
            this.id = userData.id;
            this.currentMap = userData.currentMap;
            this.outfit = userData.outfit; 
            window.OverworldMaps[userData.currentMap].playersPosition[
              userData.name
            ] = {
              direction: userData.direction,
              x: utils.withGrid(userData.x),
              y: utils.withGrid(userData.y),
            };
            object = {
              name: userData.name,
              type: "Person",
              direction: userData.direction,
              currentMap: userData.currentMap,
              isPlayerControlled: true,
              x: utils.withGrid(userData.x),
              y: utils.withGrid(userData.y),
              outfit: userData.outfit,
            }
            this.setPlayerOnline();
          }
        });
      })
      .catch((error) => {
        console.log("Update user player state error:", error);
      });

    resolve(object);
  }

  updatePlayer(state) {
    update(this.playerRef, state.player);
  }

  setPlayerOnline(id = this.id) {
    update(ref(db, `players/${id}`), { online: true });
  }

  setPlayerOffline(id = this.id) {
    update(ref(db, `players/${id}`), { online: false });
  }
}

export const playerState = new PlayerState();
