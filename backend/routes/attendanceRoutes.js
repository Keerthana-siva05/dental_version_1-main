import express from "express";
import Attendance from "../models/attendanceModel.js";
import Student from "../models/Student.js";

const router = express.Router();

// Fetch students based on course, year, and batch
// Fetch students based on course and batch
router.get("/students", async (req, res) => {
  try {
    const { course, batch } = req.query;  
    const students = await Student.find({ course, batch });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { course, batch, month, year } = req.query;
    const record = await Attendance.findOne({ course, batch, month, year });
    if (record) {
      res.json(record);
    } else {
      res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
});

// Save attendance data
router.post("/save", async (req, res) => {
  try {
    const { course, year, batch, month, students } = req.body; // Added year

    if (!students.every(s => s.regNumber)) {
      return res.status(400).json({ message: "All students must have a registration number." });
    }

    console.log("Saving attendance for:", { course, year, batch, month, students });

    let existingRecord = await Attendance.findOne({ course, year, batch, month }); // Updated query

    if (existingRecord) {
      console.log(`Updating existing attendance record for ${course} - ${year} - ${batch} - ${month}`);

      students.forEach((newStudent) => {
        const existingStudent = existingRecord.students.find((s) => s.regNumber === newStudent.regNumber);
        if (existingStudent) {
          ["theory", "clinical", "practical"].forEach((type) => {
            if (newStudent[type]) {
              existingStudent[type].total = newStudent[type].total;
              existingStudent[type].attended = newStudent[type].attended;
              existingStudent[type].percentage = (
                (newStudent[type].attended / newStudent[type].total) * 100
              ).toFixed(2);
            }
          });
        } else {
          ["theory", "clinical", "practical"].forEach((type) => {
            if (newStudent[type]) {
              newStudent[type].percentage = (
                (newStudent[type].attended / newStudent[type].total) * 100
              ).toFixed(2);
            }
          });
          existingRecord.students.push(newStudent);
        }
      });

      await existingRecord.save();
      return res.json({ message: "Attendance updated successfully" });
    } else {
      console.log("Creating new attendance record");

      students.forEach((student) => {
        student.theory = {
          total: student.theoryTotal || 0,
          attended: student.theoryAttended || 0,
          percentage: student.theoryTotal > 0
            ? ((student.theoryAttended / student.theoryTotal) * 100).toFixed(2)
            : "0.00",
        };
        student.clinical = {
          total: student.clinicalTotal || 0,
          attended: student.clinicalAttended || 0,
          percentage: student.clinicalTotal > 0
            ? ((student.clinicalAttended / student.clinicalTotal) * 100).toFixed(2)
            : "0.00",
        };
        student.practical = {
          total: student.practicalTotal || 0,
          attended: student.practicalAttended || 0,
          percentage: student.practicalTotal > 0
            ? ((student.practicalAttended / student.practicalTotal) * 100).toFixed(2)
            : "0.00",
        };
      });

      const newAttendance = new Attendance({
        course,
        year,  // Included year
        batch,  
        month,
        students,
      });

      await newAttendance.save();
      return res.json({ message: "Attendance saved successfully" });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ message: "Error saving attendance", error: error.message });
  }
});

export default router;
