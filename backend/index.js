// Import required packages
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import projectRoutes from "./routes/projects.js";
import reminderRoutes from "./routes/reminders.js";
import cors from "cors";

// load environment vairable form teh .env file
dotenv.config();

// Create Express app
const app = express();
app.use(express.json()); // Parse JSON requests

// Allow requests from your frontend's origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // optional, for cookies/auth
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB error:", err));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reminders", reminderRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
