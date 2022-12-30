import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "../config/firebase.js";
import { playerState } from "../game/PlayerState.js";
export function logout() {
  signOut(auth)
    .then(() => {
      
      // Sign-out successful.
      // console.log("logout");

      playerState.setPlayerOffline()


    })
    .catch((error) => {
      // An error happened.
      console.log("error logout");
    });
}
