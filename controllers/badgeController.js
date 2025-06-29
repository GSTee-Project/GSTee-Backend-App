import { Badge, UserBadge } from "../config/database.js";

// 🟢 Create new badge (admin use)
export const createBadge = async (req, res) => {
  try {
    const { name, requirement, levelRequired } = req.body;

    const badge = await Badge.create({ name, requirement, levelRequired });
    res.status(201).json({ message: "Badge created ✅", badge });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create badge." });
  }
};

// 🟢 Get all available badges
export const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.findAll();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch badges." });
  }
};
