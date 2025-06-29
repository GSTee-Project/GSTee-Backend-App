import express from "express";
import {
  getUserBadges,
  awardBadge,
} from "../controllers/userBadgeController.js";

const router = express.Router();

router.get("/user-badges/:userId", getUserBadges); // View all earned
router.post("/user-badges", awardBadge); // Award badge

export default router;
