import express from "express";
import { earnHeart, getHeart } from "../controllers/heartController.js";

const router = express.Router();
router.post("/hearts/earn", earnHeart);
router.get("/hearts/earn", getHeart);
export default router;
