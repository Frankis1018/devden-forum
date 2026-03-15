import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  sanitizeText,
  validatePassword,
  validateUsername,
} from "../utils/validators.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

router.post("/register", async (req, res) => {
  try {
    const username = sanitizeText(req.body.username);
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";
    const acceptedTerms = Boolean(req.body.acceptedTerms);

    const fieldErrors = {
      username: validateUsername(username),
      password: validatePassword(password),
      confirmPassword: password === confirmPassword ? "" : "Passwords do not match.",
      acceptedTerms: acceptedTerms
        ? ""
        : "You must accept the terms and privacy policy.",
    };

    const hasError = Object.values(fieldErrors).some(Boolean);
    if (hasError) {
      return res.status(400).json({
        message: "Please fix the highlighted fields.",
        fieldErrors,
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "That username is already taken.",
        fieldErrors: { username: "That username is already taken." },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    return res.status(201).json({
      message: "Registration successful.",
      token: signToken(user),
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while registering user." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = sanitizeText(req.body.username);
    const password = req.body.password || "";

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required.",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    return res.json({
      message: "Login successful.",
      token: signToken(user),
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while logging in." });
  }
});

export default router;
