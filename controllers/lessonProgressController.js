import { LessonProgress } from "../config/database.js";

export const markLessonComplete = async (req, res) => {
  try {
    const { userId, slideId } = req.body;
    const existing = await LessonProgress.findOne({
      where: { userId, slideId },
    });
    if (existing) return res.status(400).json({ message: "Already completed" });

    const progress = await LessonProgress.create({
      userId,
      slideId,
      isCompleted: true,
      completedAt: new Date(),
    });
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to complete lesson." });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const progress = await LessonProgress.count({
      where: { userId: req.params.userId },
    });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress." });
  }
};
