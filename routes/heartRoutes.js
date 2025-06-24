import express from "express";
import { earnHeart } from "../controllers/heartController.js";

const router = express.Router();
router.post("/hearts/earn", earnHeart);
export default router;
