import { json, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

//Signup or registration route
// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ email, password: hashedPassword });

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: "Error signing up" });
  }
});

//Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password reuired!!" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!!" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong Password!!" });
    }

    //Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    return res.status(400).json({ message: "Error logging in" });
  }
});

export default router;
