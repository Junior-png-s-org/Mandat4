import { openDB } from "../utils/database.js";
import bcrypt from "bcryptjs";

// ------------------------------
// INSCRIPTION
// ------------------------------
export async function register(req, res) {
  const { username, password, fullname } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Champs manquants." });

  try {
    const db = await openDB();

    const hashed = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO users (username, password, fullname) VALUES (?, ?, ?)",
      [username, hashed, fullname || ""]
    );

    res.json({ message: "Utilisateur créé !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// ------------------------------
// CONNEXION
// ------------------------------
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const db = await openDB();

    const user = await db.get(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!user) return res.status(400).json({ error: "Utilisateur introuvable." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ error: "Mot de passe invalide." });

    req.session.userId = user.id;

    res.json({ message: "Connexion réussie", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }
}

// ------------------------------
// DÉCONNEXION
// ------------------------------
export function logout(req, res) {
  req.session.destroy();
  res.json({ message: "Déconnecté !" });
}
