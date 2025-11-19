import express from "express";
import authRoutes from "./routes/auth.js"; // importe le router par défaut

const app = express();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: "instakill_secret_key_123",
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
