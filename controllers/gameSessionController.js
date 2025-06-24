import { GameSession } from "../config/database.js";

export const recordGameSession = async (req, res) => {
  try {
    const { userId, gameMode, score, correctAnswers, duration, result } =
      req.body;
    const session = await GameSession.create({
      userId,
      gameMode,
      score,
      correctAnswers,
      duration,
      result,
      playedAt: new Date(),
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to record game session." });
  }
};

export const getUserGameSessions = async (req, res) => {
  try {
    const sessions = await GameSession.findAll({
      where: { userId: req.params.userId },
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
};
