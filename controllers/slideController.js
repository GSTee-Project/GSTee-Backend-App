import { where } from "sequelize";
import { Slide } from "../config/database.js";

export const getSlides = async (req, res) => {
  try {
    const { topic } = req.query;
    // const slides = await Slide.findAll({
    //   where: topic ? { topic } : {},
    // });
    const slides = await Slide.findAll({
      where: {
        topic: "Deep Learning",
      },
      attributes: ["id"],
    });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slides." });
  }
};

export const createSlide = async (req, res) => {
  try {
    const { title, content, topic } = req.body;

    // Only count slides with the same topic
    const slideCount = await Slide.count({ where: { topic } });

    const newSlide = await Slide.create({
      title,
      content,
      topic,
      order: slideCount + 1,
    });

    res.status(201).json(newSlide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create slide." });
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

export const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Slide.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Slide not found." });
    res.json({ message: "Slide updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to update slide." });
  }
};

export const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Slide.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Slide not found." });
    res.json({ message: "Slide deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete slide." });
  }
};
