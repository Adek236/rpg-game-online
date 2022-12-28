import { registerUser } from "./services/register.js";
import { login } from "./services/login.js";
import { logout } from "./services/logout.js";

export function getGamePage() {
  document.querySelector(".title").style.display = "none";
  document.querySelector(".login-page").style.display = "none";
  document.querySelector(".register-page").style.display = "none";
  document.querySelector(".game-page").style.display = "flex";
  console.log("fire getgamepage")
}

export function getRegisterPage() {
  document.querySelector(".login-page").style.display = "none";
  document.querySelector(".register-page").style.display = "flex";
}

export function loginAuthErr(errText) {
  let sendText;
  switch (errText) {
    case 'auth/invalid-email':
    sendText = 'Invalid email.';
    break;
    case 'auth/wrong-password':
    sendText = 'Wrong password.';
    break;
    case 'auth/user-not-found':
    sendText = 'User not found.';
    break;
    case 'auth/too-many-requests':
    sendText = 'Too many requests.';
    break;
    default: 
    sendText = "Something wrong."
  }

  document.getElementById("loginAuthErr").textContent = sendText;
}

export function registerAuthErr(errText) {
  let sendText;
  switch (errText) {
    case 'auth/invalid-email':
    sendText = 'Invalid email.';
    break;
    case 'auth/email-already-in-use':
    sendText = 'Email already in use.';
    break;
    case 'auth/weak-password':
    sendText = 'Password min. 6 letters.';
    break;
    case 'auth/too-many-requests':
    sendText = 'Too many requests.';
    break;
    case 'nickname-empty':
    sendText = 'Tell me your name.';
    break;
    case 'nickname-is-used':
    sendText = 'Nickname is used.';
    break;
    default: 
    sendText = "Something wrong."
  }

  document.getElementById("registerAuthErr").textContent = sendText;
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
