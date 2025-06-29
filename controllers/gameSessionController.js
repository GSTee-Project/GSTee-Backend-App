import { GameSession, Heart } from "../config/database.js";

export const updateGameSession = async (req, res) => {
  try {
    const { sessionId, score, correctAnswers, duration, result } = req.body;

    if (!sessionId || !result) {
      return res.status(400).json({ error: "Missing sessionId or result." });
    }

    const session = await GameSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Game session not found." });
    }

    // Update session data
    session.score = score;
    session.correctAnswers = correctAnswers;
    session.duration = duration;
    session.result = result;
    session.playedAt = new Date();
    await session.save();

    res.status(200).json({
      message: "Game session updated 📝",
      session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update game session." });
  }
};

export const recordGameSession = async (req, res) => {
  try {
    const sessions = await GameSession.findAll({
      where: { userId: req.params.userId },
      order: [["playedAt", "DESC"]],
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions." });
  }
};
