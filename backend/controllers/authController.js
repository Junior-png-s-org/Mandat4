
const bcrypt = require("bcrypt");
const { get, run } = require("../utils/db");

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Nom d'utilisateur et mot de passe requis." });
    }

    const existing = await get(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing) {
      return res
        .status(400)
        .json({ error: "Ce nom d'utilisateur existe déjà." });
    }

    const hashed = await bcrypt.hash(password, 10);
    await run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    res.json({ message: "Compte créé avec succès." });
  } catch (err) {
    console.error("Erreur register:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Nom d'utilisateur et mot de passe requis." });
    }

    const user = await get(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Mot de passe incorrect." });
    }

    req.session.user = { id: user.id, username: user.username };
    res.json({ message: "Connexion réussie.", user: req.session.user });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur logout:", err);
    }
    // Supprime le cookie de session côté client
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie." });
  });
}

// Retourne l'utilisateur courant (ou null s'il n'y a pas de session)
function me(req, res) {
  if (!req.session || !req.session.user) {
    return res.json(null);
  }
  res.json(req.session.user);
}

module.exports = { register, login, logout, me };
