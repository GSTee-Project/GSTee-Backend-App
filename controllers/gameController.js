import { Heart, GameSession } from "../config/database.js";

export const unlockGame = async (req, res) => {
  try {
    const { userId, gameMode } = req.body;

    if (!userId || !gameMode) {
      return res.status(400).json({ message: "userId and gameMode required" });
    }

    // 🛑 Check for existing unlocked session
    const existingSession = await GameSession.findOne({
      where: { userId, result: null },
      order: [["createdAt", "DESC"]],
    });

    if (existingSession) {
      return res.status(200).json({
        message: "You already have an unlocked game.",
        sessionId: existingSession.id,
        gameMode: existingSession.gameMode,
      });
    }

    // ✅ Check heart
    const heart = await Heart.findOne({ where: { userId } });
    if (!heart || heart.amount < 1) {
      return res
        .status(400)
        .json({ message: "Not enough hearts to unlock game." });
    }

    // 🧮 Deduct heart and create new session
    heart.amount -= 1;
    await heart.save();

    const session = await GameSession.create({
      userId,
      gameMode,
      result: null,
    });

    res.status(201).json({
      message: "Game unlocked 🎮",
      sessionId: session.id,
      gameMode: session.gameMode,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to unlock game." });
  }
};
