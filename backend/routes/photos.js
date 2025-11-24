const express = require("express");
const { getPhotos, addPhoto, getMyPhotos } = require("../controllers/photosController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", requireAuth, getMyPhotos);
router.get("/", getPhotos);
router.post("/", requireAuth, addPhoto);

module.exports = router;