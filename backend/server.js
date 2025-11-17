import express from "express";
import authRoutes from "./routes/auth.js"; // importe le router par défaut

const app = express();
app.use(express.json());

// monte le router
app.use("/auth", authRoutes);

// route test
app.get("/", (req, res) => {
  res.send("Server OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
