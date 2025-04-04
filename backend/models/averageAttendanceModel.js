import mongoose from "mongoose";

const averageAttendanceSchema = new mongoose.Schema({
  course: { type: String, required: true },
  batch: { type: String, required: true },
  startMonth: { type: Number, required: true },
  endMonth: { type: Number, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, required: true },
  calculatedAt: { type: Date, default: Date.now },
  averages: [{
    regNumber: { type: String, required: true },
    name: { type: String, required: true },
    theoryPercentage: { type: String, required: true },
    practicalPercentage: { type: String, required: true },
    clinicalPercentage: { type: String, required: true },
    averageAttendance: { type: String, required: true }
  }]
});

// Create compound index to prevent duplicates
averageAttendanceSchema.index(
  { course: 1, batch: 1, startMonth: 1, endMonth: 1, startYear: 1, endYear: 1 },
  { unique: true }
);

const AverageAttendance = mongoose.model("AverageAttendance", averageAttendanceSchema);
export default AverageAttendance;