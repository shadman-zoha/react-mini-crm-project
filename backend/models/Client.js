import mongoose from "mongoose";

//Define client schema for database
const clientSchema = new mongoose.Schema({
  userId: { type: String, required: true }, //link to user table
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

export default mongoose.model("Client", clientSchema);
