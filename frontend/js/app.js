import { api } from "./api.js";
import { openModal } from "./modal.js";

const grid = document.getElementById("photoGrid");
const search = document.getElementById("search");

let lastPhotos = [];

// Déconnexion
document.getElementById("logoutBtn").onclick = async () => {
  await api.logout();
  window.location.href = "login.html";
};

async function loadPhotos() {
  const res = await api.getPhotos();
  const photos = await res.json();
  lastPhotos = photos;
  displayPosts(photos);
}

// Recherche
search.oninput = async () => {
  const q = search.value.trim();
  if (q === "") return displayPosts(lastPhotos);

  const res = await api.searchPhotos(q);
  const data = await res.json();
  displayPosts(data);
};

function displayPosts(photos) {
  const grid = document.getElementById("photoGrid");
  grid.innerHTML = "";

  photos.forEach(photo => {
    const post = document.createElement("div");
    post.className = "post";

    post.innerHTML = `
      <div class="post-header">
        <img class="post-pfp" src="https://api.dicebear.com/8.x/thumbs/svg?seed=${photo.author}" />
        <div class="post-user-info">
          <span class="post-user-name">${photo.author}</span>
          <span class="post-user-sub">📍 Somewhere on Earth</span>
        </div>
        <i class="fa-solid fa-ellipsis-vertical post-menu"></i>
      </div>

      <img src="${photo.download_url}" class="post-img" onclick="window.openImage('${photo.id}')">

      <div class="post-stats">
        <div class="stat">
          <i class="fa-regular fa-heart"></i> <span>2.1k</span>
        </div>
        <div class="stat">
          <i class="fa-regular fa-comment"></i> <span>120</span>
        </div>
        <div class="stat">
          <i class="fa-regular fa-bookmark"></i>
        </div>
      </div>

      <p class="post-desc">
        <strong>${photo.author}</strong> Echoes of laughter, memories forged, hearts entwined in everlasting friendship.
      </p>
    `;

    grid.appendChild(post);
  });
}

    // Image = ouvre la modal
    const img = post.querySelector(".post-img");
    img.addEventListener("click", () => openModal(photo));

    // Like
    const likeIcon = post.querySelector(".post-like");
    likeIcon.addEventListener("click", () =>
      toggleLike(photo.id, likeIcon)
    );

    // Bouton commenter
    const btnComment = post.querySelector(`[data-comment-btn="${photo.id}"]`);
    btnComment.addEventListener("click", () =>
      sendCommentFromPost(photo.id)
    );

    grid.appendChild(post);
      
    // charger likes & comments
    refreshLikes(photo.id);
    loadComments(photo.id);

// --- Likes ---

async function toggleLike(photoId, iconElement) {
  const liked = iconElement.classList.contains("liked");

  if (!liked) {
    await api.like(photoId);
    iconElement.classList.add("liked");
    iconElement.classList.replace("fa-regular", "fa-solid");
  } else {
    await api.unlike(photoId);
    iconElement.classList.remove("liked");
    iconElement.classList.replace("fa-solid", "fa-regular");
  }

  refreshLikes(photoId);
}

async function refreshLikes(photoId) {
  const res = await api.getLikes(photoId);
  const data = await res.json();
  const span = document.querySelector(`[data-photo-likes="${photoId}"]`);
  if (span) span.textContent = data.likes;

  // synchro avec la modal si ouverte
  const modalLikes = document.getElementById("modalLikes");
  if (modalLikes && modalLikes.dataset.photoId === String(photoId)) {
    modalLikes.textContent = data.likes;
  }
}

// --- Comments ---

async function loadComments(photoId) {
  const res = await api.getComments(photoId);
  const comments = await res.json();
  const container = document.querySelector(
    `[data-photo-comments="${photoId}"]`
  );
  if (!container) return;

  container.innerHTML = "";
  comments.slice(-3).forEach(c => {
    const p = document.createElement("p");
    p.textContent = c.comment;
    container.appendChild(p);
  });

  // synchro avec modal
  if (
    document.getElementById("commentList") &&
    document.getElementById("commentList").dataset.photoId === String(photoId)
  ) {
    const modalList = document.getElementById("commentList");
    modalList.innerHTML = "";
    comments.forEach(c => {
      const p = document.createElement("p");
      p.textContent = c.comment;
      modalList.appendChild(p);
    });
  }
}

async function sendCommentFromPost(photoId) {
  const input = document.querySelector(
    `[data-comment-input="${photoId}"]`
  );
  if (!input || !input.value.trim()) return;

  await api.addComment(photoId, input.value.trim());
  input.value = "";
  loadComments(photoId);
}

// rendre util dispo pour modal
export { refreshLikes, loadComments };

loadPhotos();
