import express from "express";
import { unlockGame } from "../controllers/gameController.js";

const router = express.Router();
router.post("/game/unlock", unlockGame);
export default router;
