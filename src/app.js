import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "./config/firebase.js"
import { getGamePage } from "./app-ui.js";

(function () {
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      console.log("login");
      getGamePage();
    } else {
      console.log("not login");
    }
  });

})();
