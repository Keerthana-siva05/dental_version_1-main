import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
});

export default mongoose.model("Student", StudentSchema);
