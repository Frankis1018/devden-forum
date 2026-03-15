import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import Category from "./models/Category.js";
import Question from "./models/Question.js";
import User from "./models/User.js";

const categories = [
  {
    name: "JavaScript",
    description: "Language basics, debugging, and modern syntax.",
    order: 1,
  },
  {
    name: "React",
    description: "Components, state, hooks, and routing.",
    order: 2,
  },
  {
    name: "Node.js",
    description: "Backend patterns, APIs, and package tooling.",
    order: 3,
  },
  {
    name: "CSS",
    description: "Layout, styling, and responsive design.",
    order: 4,
  },
  {
    name: "Career Advice",
    description: "Projects, portfolio building, and interview preparation.",
    order: 5,
  },
];

async function seed() {
  await connectDb();

  await Promise.all([
    Category.deleteMany({}),
    Question.deleteMany({}),
    User.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Password1", 10);
  const demoUser = await User.create({
    username: "demo_user",
    passwordHash,
  });

  const insertedCategories = await Category.insertMany(categories);

  const [javascript, react, node] = insertedCategories;

  await Question.insertMany([
    {
      body: "How do I use array.map() without mutating my original data?",
      categoryId: javascript._id,
      categoryName: javascript.name,
      authorId: demoUser._id,
      authorName: demoUser.username,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      answers: [
        {
          body: "map returns a new array, so the original array remains unchanged unless you modify its objects directly.",
          authorId: demoUser._id,
          authorName: demoUser.username,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        },
      ],
    },
    {
      body: "Why is my React component re-rendering every time state changes?",
      categoryId: react._id,
      categoryName: react.name,
      authorId: demoUser._id,
      authorName: demoUser.username,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
      answers: [
        {
          body: "A state update causes the component that owns that state to render again. You can optimize children with memo when appropriate.",
          authorId: demoUser._id,
          authorName: demoUser.username,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        },
      ],
    },
    {
      body: "What is the difference between Express middleware and route handlers?",
      categoryId: node._id,
      categoryName: node.name,
      authorId: demoUser._id,
      authorName: demoUser.username,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
      answers: [],
    },
  ]);

  console.log("Database seeded successfully.");
  console.log("Demo login -> username: demo_user | password: Password1");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
