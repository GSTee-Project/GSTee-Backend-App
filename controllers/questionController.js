import { GameSession, Question } from "../config/database.js";

// Create question
export const createQuestion = async (req, res) => {
  try {
    const { question, options, answer, type, slideId } = req.body;
    const newQuestion = await Question.create({
      question,
      options,
      answer,
      type,
      slideId,
    });
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: "Failed to create question." });
  }
};

// Get random questions (e.g., for a game mode)
export const getRandomQuestions = async (req, res) => {
  try {
    const { userId } = req.body || req.query;
    const count = parseInt(req.query.count || req.body.count) || 5;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // ✅ Check for an active unlocked game session
    const unlockedSession = await GameSession.findOne({
      where: {
        userId,
        result: null, // Means game is unlocked but not finished
      },
      order: [["createdAt", "DESC"]],
    });

    if (!unlockedSession) {
      return res.status(403).json({
        error: "You must unlock the game before accessing questions.",
      });
    }

    const questions = await Question.findAll({
      limit: count,
    });

    res.json({ sessionId: unlockedSession.id, questions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch questions." });
  }
};

// Get by slide
export const getQuestionsBySlide = async (req, res) => {
  try {
    const slideId = req.params.slideId;
    const questions = await Question.findAll({ where: { slideId } });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slide questions." });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, answer, type } = req.body;

    const existing = await Question.findByPk(id);
    if (!existing) {
      return res.status(404).json({ error: "Question not found." });
    }

    existing.question = question ?? existing.question;
    existing.options = options ?? existing.options;
    existing.answer = answer ?? existing.answer;
    existing.type = type ?? existing.type;

    await existing.save();

    res.json({ message: "Question updated ✅", question: existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update question." });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    await question.destroy();
    res.json({ message: "Question deleted successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete question." });
  }
};

// Submit question
export const submitQuestions = (req, res) => {
  res.json({ message: "Game submit" });
};
