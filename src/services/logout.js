import { signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "../config/firebase.js";

export function logout() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("logout");
    })
    .catch((error) => {
      // An error happened.
      console.log("error logout");
    });
}
