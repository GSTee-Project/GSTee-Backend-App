import express from "express";
import {
  createQuestion,
  getRandomQuestions,
  getQuestionsBySlide,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.post("/questions", createQuestion);
router.get("/questions/random", getRandomQuestions);
router.get("/questions/by-slide/:slideId", getQuestionsBySlide);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
