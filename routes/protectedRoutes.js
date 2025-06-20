import express from " express";
import { authMiddleware } from "../middleware/authMiddleWare";
import { Dashboard } from "../controllers/protected.js";
const router = express.Router();

router.get("/dashboard", authMiddleware, Dashboard);
