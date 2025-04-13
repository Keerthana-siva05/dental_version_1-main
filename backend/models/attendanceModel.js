import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  total: { type: Number, required: true, default: 0 },
  attended: { type: Number, required: true, default: 0 },
  percentage: { type: Number, default: 0 }  // Ensures percentage is stored
});

const StudentAttendanceSchema = new mongoose.Schema({
  regNumber: { type: String, required: true },
  name: { type: String, required: true },
  currentYear: { type: String, required: true }, // Add this line
  theory: categorySchema,
  practical: categorySchema,
  clinical: categorySchema
});

const AttendanceSchema = new mongoose.Schema({
  course: { type: String, required: true },
  year: { type: String, required: true },
  currentYear: { type: String, required: true }, // Add this line for the overall record
  batch: { type: String, required: true },
  month: { type: String, required: true },
  students: [StudentAttendanceSchema],
});

AttendanceSchema.index({ course: 1, year: 1, batch: 1, month: 1 }, { unique: true }); // Updated Index

const Attendance = mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
