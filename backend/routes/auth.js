import express from "express";
import { login, register } from "../controllers/authController.js";


const router = express.Router();

// route inscription
router.post("/register", register);

// route connexion
router.post("/login", login);

// route déconnexion
router.post("/logout", logout);

export default router;
