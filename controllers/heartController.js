import { Heart, LessonProgress } from "../config/database.js";

export const earnHeart = async (req, res) => {
  try {
    const { userId } = req.body;

    let completedCount = await LessonProgress.count({
      where: { userId, isCompleted: true },
    });

    if (completedCount < 5) {
      return res
        .status(200)
        .json({ message: "Complete more lessons to earn hearts." });
    }

    let heart = await Heart.findOne({ where: { userId } });

    // If first time, create record
    if (!heart) {
      const milestonesPassed = Math.floor(completedCount / 5);
      const lastMilestone = milestonesPassed * 5;

      heart = await Heart.create({
        userId,
        amount: milestonesPassed,
        lastEarnedAt: new Date(),
        lastMilestone,
      });

      return res
        .status(201)
        .json({ message: `Awarded ${milestonesPassed} heart(s) 🎉`, heart });
    }

    const milestonesPassed = Math.floor(completedCount / 5);
    const oldMilestone = heart.lastMilestone || 0;

    if (completedCount >= oldMilestone + 5) {
      const newHearts = Math.floor((completedCount - oldMilestone) / 5);
      heart.amount += newHearts;
      heart.lastMilestone = oldMilestone + newHearts * 5;
      heart.lastEarnedAt = new Date();
      await heart.save();

      return res
        .status(201)
        .json({ message: `Awarded ${newHearts} heart(s) 🎉`, heart });
    }

    return res.status(200).json({ message: "No new hearts to award yet." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Something went wrong while awarding hearts." });
  }
};

export const getHeart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const heart = await Heart.findOne({ where: { userId } });

    if (!heart) {
      return res
        .status(404)
        .json({ message: "No hearts found for this user." });
    }

    res.json(heart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch heart data." });
  }
};
