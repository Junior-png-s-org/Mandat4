
import { setupCommon } from "./common.js";
import { api } from "./api.js";

setupCommon();

const usernameEl = document.getElementById("profileUsername");
const fullNameEl = document.getElementById("profileFullName");
const bioEl = document.getElementById("profileBio");
const postsCountEl = document.getElementById("profilePostsCount");
const followersEl = document.getElementById("profileFollowers");
const followingEl = document.getElementById("profileFollowing");
const avatarEl = document.getElementById("profileAvatar");
const gridEl = document.getElementById("profileGrid");

async function loadProfile() {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const user = await res.json();
    if (!user || !user.username) {
      window.location.href = "login.html";
      return;
    }

    const username = user.username;
    if (usernameEl) usernameEl.textContent = username;
    if (fullNameEl) fullNameEl.textContent = username;
    if (bioEl) bioEl.textContent = "Bienvenue sur ton profil Instakill ✨";
    if (avatarEl) {
      avatarEl.src = `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(
        username
      )}`;
    }

    const photos = await fetch("/api/photos/me", {
      credentials: "include",
    }).then((r) => r.json());

    const postsCount = Array.isArray(photos) ? photos.length : 0;
    if (postsCountEl) postsCountEl.textContent = postsCount.toString();

    // followers/following: placeholders pour l'instant
    if (followersEl) followersEl.textContent = "0";
    if (followingEl) followingEl.textContent = "0";

    if (gridEl) {
      gridEl.innerHTML = "";
      if (!photos || !photos.length) {
        gridEl.innerHTML = "<p>Aucune photo publiée pour le moment.</p>";
      } else {
        photos.forEach((p) => {
          const div = document.createElement("div");
          div.className = "profile-grid-item";
          div.innerHTML = `<img src="${p.image_path}" alt="photo" />`;
          gridEl.appendChild(div);
        });
      }
    }
  } catch (err) {
    console.error("Erreur chargement profil:", err);
  }
}

loadProfile();
