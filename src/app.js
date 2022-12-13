import { app } from "./config/firebase.js";
import {
  ref,
  set,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

function getRegisterPage() {
  document.querySelector(".login").style.display = "none";
  document.querySelector(".register").style.display = "flex";
}

(function () {
  const auth = getAuth(app);
  const db = getDatabase(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);

      // const playerId = user.uid;
      // const playerRef = ref(db, `players/${playerId}`);

      // set(playerRef, {
      //   id: playerId,
      //   name: "Pikasoo",
      // });

    } else {
      console.log("not login"); 
    }
  });

  signInAnonymously(auth)
    .then(() => {
      console.log("sign in");
    })
    .catch(() => {
      console.log("error");
    });

  document.getElementById("create-acc-link").addEventListener("click", () => {
    getRegisterPage();
  });
})();
