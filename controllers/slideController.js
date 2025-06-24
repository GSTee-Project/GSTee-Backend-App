import { Slide } from "../config/database.js";

export const createSlide = async (req, res) => {
  try {
    const slide = await Slide.create(req.body);
    res.status(201).json(slide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create slide." });
  }
};

export const getSlides = async (req, res) => {
  try {
    const { topic } = req.query;
    const slides = await Slide.findAll({ where: topic ? { topic } : {} });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slides." });
  }
};

export const getSlideById = async (req, res) => {
  try {
    const slide = await Slide.findByPk(req.params.id);
    if (!slide) return res.status(404).json({ error: "Slide not found." });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slide." });
  }
};
