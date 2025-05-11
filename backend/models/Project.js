import mongoose from "mongoose";

// Define the project table
const projectSchema = new mongoose.Schema({
  userId: { type: String, required: true }, //link to the user table
  clientId: { type: String, required: true }, // link to thr client table
  title: { type: String, required: true },
  budget: { type: Number, required: true },
  status: { type: String, required: true },
});

export default mongoose.model("Project", projectSchema);
