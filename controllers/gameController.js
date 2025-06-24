import { Heart, GameSession } from "../config/database.js";

export const unlockGame = async (req, res) => {
  try {
    const { userId, gameMode } = req.body;
    const heart = await Heart.findOne({ where: { userId } });

    if (!heart || heart.amount < 1) {
      return res
        .status(400)
        .json({ message: "Not enough hearts to unlock game." });
    }

    heart.amount -= 1;
    await heart.save();

    const session = await GameSession.create({
      userId,
      gameMode,
      result: null, // Not yet played
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to unlock game." });
  }
};
