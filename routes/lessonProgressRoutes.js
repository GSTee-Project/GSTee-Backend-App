import express from "express";
import {
  markLessonComplete,
  getUserProgress,
} from "../controllers/lessonProgressController.js";

const router = express.Router();
router.post("/lesson-progress/complete", markLessonComplete);
router.get("/lesson-progress/:userId", getUserProgress);
export default router;
