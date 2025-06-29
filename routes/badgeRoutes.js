import express from "express";
import { createBadge, getAllBadges } from "../controllers/badgeController.js";

const router = express.Router();

router.post("/badges", createBadge); // Admin use
router.get("/badges", getAllBadges); // Public/All

export default router;
