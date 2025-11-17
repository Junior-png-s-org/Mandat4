import express from "express";
import session from "express-session";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";
import photoRoutes from "./routes/photos.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";

const app = express();

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
