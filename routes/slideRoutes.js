import express from "express";
import {
  createSlide,
  getSlides,
  getSlideById,
} from "../controllers/slideController.js";

const router = express.Router();
router.post("/slides", createSlide);
router.get("/slides", getSlides);
router.get("/slides/:id", getSlideById);
export default router;
