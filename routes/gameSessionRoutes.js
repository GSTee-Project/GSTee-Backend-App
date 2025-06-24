import express from "express";
import {
  recordGameSession,
  getUserGameSessions,
} from "../controllers/gameSessionController.js";

const router = express.Router();
router.post("/game/sessions", recordGameSession);
router.get("/game/sessions/:userId", getUserGameSessions);
export default router;
