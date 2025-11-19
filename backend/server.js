import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import photoRoutes from "./routes/photos.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";

const app = express();

// Pour __dirname dans ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: "instaclone_secret_key_123",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// 🔥 Servir le frontend (dossier PUBLIC)
app.use(express.static(path.join(__dirname, "../public")));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

// 🔥 Important : redirige toute URL vers index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
