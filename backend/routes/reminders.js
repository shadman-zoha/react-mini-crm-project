import { Router } from "express";
import jwt from "jsonwebtoken";
import Reminder from "../models/Reminder.js";

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

// Add new reminder
router.post("/", auth, async (req, res) => {
  try {
    const { clientId, message, dueDate } = req.body;

    // Check if fields are empty
    if (!clientId || !message || !dueDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Create reminder
    const reminder = await Reminder.create({
      userId: req.userId,
      clientId,
      message,
      dueDate,
    });

    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: "Error adding reminder" });
  }
});

// Get all reminders
router.get("/", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId });
    res.json(reminders);
  } catch (error) {
    res.status(400).json({ message: "Error getting reminders" });
  }
});

export default router;
