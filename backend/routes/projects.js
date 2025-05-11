import { Router } from "express";
import jwt from "jsonwebtoken";
import Project from "../models/Project.js";

const router = Router();

// Middleware to check if user is logged in
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Add new projects
router.post("/", auth, async (req, res) => {
  try {
    const { clientId, title, budget, status } = req.body;

    // Check if fields are empty
    if (!clientId || !title || !budget || !status) {
      return res.status(400).json({ message: "All fields are required!!" });
    }

    // Create a new peroject
    const project = await Project.create({
      userId: req.userId,
      clientId,
      title,
      budget,
      status,
    });
    res.json({ project });
  } catch (error) {
    res.status(400).json({ message: "Error adding new project!!" });
  }
});

// Get all projects
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: "Error getting projects" });
  }
});

export default router;
