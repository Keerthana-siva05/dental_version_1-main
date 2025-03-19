import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema({
  regNumber: { type: String, required: true },
  name: { type: String, required: true },
  year: { type: String, required: true },
  assessmentType: { type: String, required: true },
  theory70: { type: Number, default: null },
  theory20: { type: Number, default: null },
  theory10: { type: Number, default: null },
  totalTheory: { type: Number, default: null },
  practical90: { type: Number, default: null },
  practical10: { type: Number, default: null },
  totalPractical: { type: Number, default: null },
});

export default mongoose.model("Assessment", AssessmentSchema);
