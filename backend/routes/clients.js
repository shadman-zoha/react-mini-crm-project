import { Router } from "express";
import jwt from "jsonwebtoken";
import Client from "../models/Client.js";

const router = Router();

// Middleware to check if the user is logged in
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
    res.status(400).json({ message: "Error adding client" });
  }
};

// Add new client
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Check if the fileds are empty
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    //Create Client
    const client = await Client.create({
      userId: req.userId,
      name,
      email,
      phone,
    });
    res.json({ client });
  } catch (error) {
    res.status(400).json({ message: "Error adding client" });
  }
});

// Get all clients
router.get("/", auth, async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.userId });
    res.json(clients);
  } catch (error) {
    res.status(400).json({ message: "Error getting clients" });
  }
});
export default router;
