
const API_BASE = "/api";

async function jsonOrEmpty(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export const api = {
  async signup(username, password) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    const data = await jsonOrEmpty(res);
    if (!res.ok) {
      return { ok: false, error: data.error || "Erreur lors de l'inscription." };
    }
    return { ok: true, message: data.message };
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    const data = await jsonOrEmpty(res);
    if (!res.ok) {
      return { ok: false, error: data.error || "Erreur de connexion." };
    }
    return { ok: true, user: data.user };
  },

  async logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async getPhotos(search = "") {
    const url = search
      ? `${API_BASE}/photos?search=${encodeURIComponent(search)}`
      : `${API_BASE}/photos`;
    const res = await fetch(url, { credentials: "include" });
    return jsonOrEmpty(res);
  },

  async addPhoto(image_path, caption = "") {
    const res = await fetch(`${API_BASE}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_path, caption }),
      credentials: "include",
    });
    return jsonOrEmpty(res);
  },

  async getLikes(photoId) {
    const res = await fetch(`${API_BASE}/likes/${photoId}`, {
      credentials: "include",
    });
    return jsonOrEmpty(res);
  },

  async toggleLike(photoId) {
    const res = await fetch(`${API_BASE}/likes/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id: photoId }),
      credentials: "include",
    });
    return jsonOrEmpty(res);
  },

  async getComments(photoId) {
    const res = await fetch(`${API_BASE}/comments/${photoId}`, {
      credentials: "include",
    });
    return jsonOrEmpty(res);
  },

  async addComment(photoId, comment) {
    const res = await fetch(`${API_BASE}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo_id: photoId, comment }),
      credentials: "include",
    });
    return jsonOrEmpty(res);
  },

  deletePhoto(id){
    return fetch(`${API_BASE}/photos/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(r => jsonOrEmpty(r));
  }
};
