import express from "express";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import { requireAuth } from "../middleware/auth.js";
import {
  sanitizeText,
  validateAnswerBody,
  validateQuestionBody,
} from "../utils/validators.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const categoryId = req.body.categoryId || "";
    const body = sanitizeText(req.body.body);

    const bodyError = validateQuestionBody(body);
    if (bodyError) {
      return res.status(400).json({
        message: bodyError,
        fieldErrors: { body: bodyError },
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        message: "A valid category is required.",
        fieldErrors: { categoryId: "Please choose a category." },
      });
    }

    const question = await Question.create({
      body,
      categoryId: category._id,
      categoryName: category.name,
      authorId: req.user._id,
      authorName: req.user.username,
      answers: [],
    });

    return res.status(201).json({
      message: "Question posted successfully.",
      question,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not create question." });
  }
});

router.get("/:questionId", requireAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    return res.json(question);
  } catch (error) {
    return res.status(500).json({ message: "Could not load question." });
  }
});

router.post("/:questionId/answers", requireAuth, async (req, res) => {
  try {
    const body = sanitizeText(req.body.body);
    const answerError = validateAnswerBody(body);

    if (answerError) {
      return res.status(400).json({
        message: answerError,
        fieldErrors: { body: answerError },
      });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    question.answers.push({
      body,
      authorId: req.user._id,
      authorName: req.user.username,
    });

    await question.save();

    return res.status(201).json({
      message: "Answer added successfully.",
      question,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not save answer." });
  }
});

export default router;
