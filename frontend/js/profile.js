
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
const openEditBtn = document.getElementById("openEditProfile");
const editModal = document.getElementById("editProfileModal");
const closeEditBtn = document.getElementById("closeEditProfile");
const editForm = document.getElementById("editProfileForm");
const editFullName = document.getElementById("editFullName");
const editBio = document.getElementById("editBio");
const editAvatarUrl = document.getElementById("editAvatarUrl");
const storiesRow = document.getElementById("storiesRow");
const addStoryBubble = document.getElementById("addStoryBubble");
const createStoryModal = document.getElementById("createStoryModal");
const closeCreateStory = document.getElementById("closeCreateStory");
const createStoryForm = document.getElementById("createStoryForm");
const storyTitleInput = document.getElementById("storyTitle");
const storyImageUrlInput = document.getElementById("storyImageUrl");
const storyVideoUrlInput = document.getElementById("storyVideoUrl");
const viewStoryModal = document.getElementById("viewStoryModal");
const closeViewStory = document.getElementById("closeViewStory");
const viewStoryImg = document.getElementById("viewStoryImg");
const viewStoryTitle = document.getElementById("viewStoryTitle");

async function loadProfile() {
  try {
    const user = await api.me();
    if (!user || !user.username) {
      window.location.href = "login.html";
      return;
    }

    const username = user.username;
    if (usernameEl) usernameEl.textContent = username;
    const fullName = user.full_name || username;
    const bio = user.bio || "Bienvenue sur ton profil Instakill ✨";
    const avatarUrl = user.avatar_url || `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(username)}`;
    if (fullNameEl) fullNameEl.textContent = fullName;
    if (bioEl) bioEl.textContent = bio;
    if (avatarEl) {
      avatarEl.src = avatarUrl;
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

if (openEditBtn && editModal) {
  openEditBtn.addEventListener("click", async () => {
    const user = await api.getProfile();
    if (editFullName) editFullName.value = user.full_name || "";
    if (editBio) editBio.value = user.bio || "";
    if (editAvatarUrl) editAvatarUrl.value = user.avatar_url || "";
    editModal.style.display = "flex";
  });
}

if (closeEditBtn && editModal) {
  closeEditBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });
}

if (editModal) {
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.style.display = "none";
  });
}

if (editForm) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      full_name: editFullName ? editFullName.value.trim() : "",
      bio: editBio ? editBio.value.trim() : "",
      avatar_url: editAvatarUrl ? editAvatarUrl.value.trim() : "",
    };
    await api.updateProfile(payload);
    await loadProfile();
    if (editModal) editModal.style.display = "none";
  });
}

async function loadStories() {
  try {
    const stories = await api.getMyStories();
    if (!storiesRow) return;
    storiesRow.querySelectorAll(".story-bubble[data-story-id]").forEach((n) => n.remove());
    const list = Array.isArray(stories) ? stories : [];
    list.forEach((s) => {
      const sb = document.createElement("div");
      sb.className = "story-bubble";
      sb.setAttribute("data-story-id", String(s.id));
      sb.style.cursor = "pointer";
      const isVideo = !!s.video_url;
      sb.innerHTML = isVideo
        ? `
          <div class="story-avatar" style="position:relative;background:#000;display:flex;align-items:center;justify-content:center;">
            <i class="fa-solid fa-play" style="color:white"></i>
          </div>
          <p>${s.title || s.username || "Story"}</p>
        `
        : `
          <div class="story-avatar">
            <img id="storyImg_${s.id}" alt="story" />
          </div>
          <p>${s.title || s.username || "Story"}</p>
        `;
      if (!isVideo) {
        const imgEl = sb.querySelector(`#storyImg_${s.id}`);
        if (imgEl) {
          imgEl.referrerPolicy = "no-referrer";
          imgEl.crossOrigin = "anonymous";
          imgEl.src = `/api/proxy?url=${encodeURIComponent(s.image_url)}`;
        }
      }
      sb.addEventListener("click", () => {
        if (viewStoryTitle) viewStoryTitle.textContent = s.title || "Story";
        if (isVideo) {
          if (viewStoryImg) viewStoryImg.style.display = "none";
          let video = document.getElementById("viewStoryVideo");
          if (!video) {
            const wrap = document.querySelector("#viewStoryModal .modal-image-wrapper");
            video = document.createElement("video");
            video.id = "viewStoryVideo";
            video.style.width = "100%";
            video.style.height = "100%";
            video.setAttribute("controls", "");
            video.setAttribute("autoplay", "");
            video.setAttribute("muted", "");
            video.setAttribute("loop", "");
            if (wrap) wrap.appendChild(video);
          }
          video.src = `/api/proxy?url=${encodeURIComponent(s.video_url)}`;
        } else {
          const video = document.getElementById("viewStoryVideo");
          if (video) video.remove();
          if (viewStoryImg) {
            viewStoryImg.style.display = "block";
            viewStoryImg.referrerPolicy = "no-referrer";
            viewStoryImg.crossOrigin = "anonymous";
            viewStoryImg.src = `/api/proxy?url=${encodeURIComponent(s.image_url)}`;
          }
        }
        if (viewStoryModal) viewStoryModal.style.display = "flex";
      });
      storiesRow.appendChild(sb);
    });
  } catch (err) {
    console.error("Erreur chargement stories:", err);
  }
}

loadStories();

if (addStoryBubble && createStoryModal) {
  addStoryBubble.addEventListener("click", () => {
    if (createStoryModal) createStoryModal.style.display = "flex";
  });
}

if (closeCreateStory && createStoryModal) {
  closeCreateStory.addEventListener("click", () => {
    createStoryModal.style.display = "none";
  });
}

if (createStoryModal) {
  createStoryModal.addEventListener("click", (e) => {
    if (e.target === createStoryModal) createStoryModal.style.display = "none";
  });
}

if (createStoryForm) {
  createStoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const imageUrl = storyImageUrlInput ? storyImageUrlInput.value.trim() : "";
    const title = storyTitleInput ? storyTitleInput.value.trim() : "";
    const videoUrl = storyVideoUrlInput ? storyVideoUrlInput.value.trim() : "";
    if (!imageUrl && !videoUrl) return;
    await api.addStory(imageUrl, title, videoUrl);
    if (createStoryModal) createStoryModal.style.display = "none";
    if (storyImageUrlInput) storyImageUrlInput.value = "";
    if (storyTitleInput) storyTitleInput.value = "";
    if (storyVideoUrlInput) storyVideoUrlInput.value = "";
    await loadStories();
  });
}

if (closeViewStory && viewStoryModal) {
  closeViewStory.addEventListener("click", () => {
    viewStoryModal.style.display = "none";
  });
}

if (viewStoryModal) {
  viewStoryModal.addEventListener("click", (e) => {
    if (e.target === viewStoryModal) viewStoryModal.style.display = "none";
  });
}
