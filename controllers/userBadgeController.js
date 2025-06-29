import { UserBadge, Badge } from "../config/database.js";

// 🟢 Get all badges earned by a user
export const getUserBadges = async (req, res) => {
  try {
    const { userId } = req.params;

    const earned = await UserBadge.findAll({
      where: { userId },
      include: [Badge],
    });

    res.json(earned);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user badges." });
  }
};

// 🟢 Award badge manually
export const awardBadge = async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    // Prevent duplicate badge
    const existing = await UserBadge.findOne({ where: { userId, badgeId } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Badge already awarded to this user." });
    }

    const awarded = await UserBadge.create({ userId, badgeId });
    res.status(201).json({ message: "Badge awarded 🎉", awarded });
  } catch (err) {
    res.status(500).json({ error: "Failed to award badge." });
  }
};
