import express from "express";
import {
  recordGameSession,
  updateGameSession,
} from "../controllers/gameSessionController.js";

const router = express.Router();
router.post("/game/sessions", updateGameSession);
router.get("/game/sessions/:userId", recordGameSession);
export default router;
