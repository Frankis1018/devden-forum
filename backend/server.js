import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import questionRoutes from "./routes/questions.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins =
  process.env.FRONTEND_URL?.split(",").map((value) => value.trim()) || ["*"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: false,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/questions", questionRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
    process.exit(1);
  });
