import express from "express";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Could not load categories." });
  }
});

router.get("/:categoryId/questions", requireAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const questions = await Question.find({ categoryId: category._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json({
      category,
      questions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not load category questions." });
  }
});

export default router;
