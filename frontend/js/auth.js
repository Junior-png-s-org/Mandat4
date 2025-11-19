import { api } from "./api.js";

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const res = await api.login(email, pass);
    if (res.ok) window.location.href = "index.html";
    else alert("Erreur de connexion");
  };
}

if (signupBtn) {
  signupBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const res = await api.signup(email, pass);
    if (res.ok) window.location.href = "login.html";
    else alert("Erreur !");
  };
}
