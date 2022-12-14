import { registerUser } from "./services/register.js";
import { login } from "./services/login.js";
import { logout } from "./services/logout.js";

export function getGamePage() {
  document.querySelector(".login-page").style.display = "none";
  document.querySelector(".register-page").style.display = "none";
  document.querySelector(".game-page").style.display = "block";
}

export function getRegisterPage() {
  document.querySelector(".login-page").style.display = "none";
  document.querySelector(".register-page").style.display = "flex";
}

(function () {
  // Login
  document.getElementById("loginSubmitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    login();
  });

  // Register
  document.getElementById("createAccLink").addEventListener("click", () => {
    getRegisterPage();
  });

  document
    .getElementById("registerSubmitBtn")
    .addEventListener("click", (e) => {
      e.preventDefault();
      registerUser();
    });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
  });
})();
