import { openDB } from "../utils/database.js";
import bcrypt from "bcrypt";

export async function register(req, res) {
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ error: "Champs requis manquants." });

    const db = await openDB();
    const exist = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (exist) return res.status(400).json({ error: "Utilisateur déjà existant." });

    const hashed = await bcrypt.hash(password, 10);

    await db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashed]
    );

    res.json({ message: "Compte créé avec succès !" });
}

export async function login(req, res) {
    const { username, password } = req.body;

    const db = await openDB();
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Mot de passe incorrect" });

    req.session.user = { id: user.id, username: user.username };

    res.json({ message: "Connexion réussie", user: req.session.user });
}

export function logout(req, res) {
    req.session.destroy(() => {
        res.json({ message: "Déconnecté" });
    });
}
