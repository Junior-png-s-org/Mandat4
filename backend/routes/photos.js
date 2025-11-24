import express from "express";
import { getPhotos, addPhoto } from "../controllers/photosController.js";

const router = express.Router();

router.get("/", getPhotos);
router.post("/", addPhoto);

export default router;
