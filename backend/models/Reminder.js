import mongoose from "mongoose";

// Define the reminder table into the database
const reminderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, //link to the user table
  clientId: { type: String, required: true }, //link to the client tbale
  message: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

export default mongoose.model("Reminder", reminderSchema);
