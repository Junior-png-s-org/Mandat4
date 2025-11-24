import { openDB } from "../utils/database.js";

export async function getPhotos(req, res) {
    const db = await openDB();
    const photos = await db.all("SELECT * FROM photos ORDER BY created_at DESC");
    res.json(photos);
}

export async function addPhoto(req, res) {
    const { user_id, image_path, caption } = req.body;

    if (!user_id || !image_path)
        return res.status(400).json({ error: "Champs manquants." });

    const db = await openDB();
    await db.run(
        "INSERT INTO photos (user_id, image_path, caption, created_at) VALUES (?, ?, ?, datetime('now'))",
        [user_id, image_path, caption]
    );

    res.json({ message: "Photo ajoutée !" });
}
