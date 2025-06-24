import { Heart } from "../config/database.js";

export const earnHeart = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    let heart = await Heart.findOne({ where: { userId } });

    if (!heart) {
      heart = await Heart.create({ userId, amount, lastEarnedAt: new Date() });
    } else {
      heart.amount += amount;
      heart.lastEarnedAt = new Date();
      await heart.save();
    }
    res.json(heart);
  } catch (err) {
    res.status(500).json({ error: "Failed to earn heart." });
  }
};
