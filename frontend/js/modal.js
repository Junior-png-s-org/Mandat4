import { api } from "./api.js";
import { refreshLikes, loadComments } from "./app.js";

const modal = document.getElementById("photoModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImg = document.getElementById("modalImg");
const modalAuthor = document.getElementById("modalAuthor");
const modalLikes = document.getElementById("modalLikes");
const modalLikeIcon = document.getElementById("modalLikeIcon");
const commentList = document.getElementById("commentList");
const newComment = document.getElementById("newComment");
const sendComment = document.getElementById("sendComment");

let currentPhotoId = null;

export function openModal(photo) {
  currentPhotoId = photo.id;
  modal.style.display = "flex";

  modalImg.src = photo.download_url;
  modalAuthor.textContent = photo.author;

  modalLikes.dataset.photoId = String(photo.id);
  commentList.dataset.photoId = String(photo.id);

  // reset icon
  modalLikeIcon.classList.remove("liked");
  modalLikeIcon.classList.add("fa-regular");
  modalLikeIcon.classList.remove("fa-solid");

  refreshLikes(photo.id);
  loadComments(photo.id);
}

closeModalBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Like depuis la modal
modalLikeIcon.addEventListener("click", async () => {
  if (!currentPhotoId) return;

  const liked = modalLikeIcon.classList.contains("liked");

  if (!liked) {
    await api.like(currentPhotoId);
    modalLikeIcon.classList.add("liked");
    modalLikeIcon.classList.replace("fa-regular", "fa-solid");
  } else {
    await api.unlike(currentPhotoId);
    modalLikeIcon.classList.remove("liked");
    modalLikeIcon.classList.replace("fa-solid", "fa-regular");
  }

  refreshLikes(currentPhotoId);
});

// Commentaire depuis la modal
sendComment.addEventListener("click", async () => {
  if (!currentPhotoId || !newComment.value.trim()) return;

  await api.addComment(currentPhotoId, newComment.value.trim());
  newComment.value = "";
  loadComments(currentPhotoId);
});
