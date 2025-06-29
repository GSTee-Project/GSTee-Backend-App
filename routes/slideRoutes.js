import express from "express";
import {
  createSlide,
  getSlides,
  getSlideById,
  deleteSlide,
  updateSlide,
} from "../controllers/slideController.js";

const router = express.Router();
router.post("/slides", createSlide);
router.get("/slides", getSlides);
router.get("/slides/:id", getSlideById);
router.put("/slides/:id", updateSlide);
router.delete("/slides/:id", deleteSlide);
export default router;
