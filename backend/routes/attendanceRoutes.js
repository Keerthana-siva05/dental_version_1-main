import express from "express";
import Attendance from "../models/attendanceModel.js";
import AverageAttendance from "../models/averageAttendanceModel.js"; // New model
import Student from "../models/Student.js";

const router = express.Router();

// Fetch students based on course, year, and batch
// Fetch students based on course and batch
router.get("/students", async (req, res) => {
  try {
    const { course, batch } = req.query;  
    const students = await Student.find({ course, batch });
    res.json({ students }); // Wrap in an object
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
    const { course, year, batch, month, currentYear, students } = req.body;

    // Validate required fields
    if (!course || !year || !batch || !month || !currentYear || !students) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    if (!students.every(s => s.regNumber && s.name && s.currentYear)) {
      return res.status(400).json({ 
        message: "All students must have registration number, name, and current year." 
      });
    }

    console.log("Saving attendance for:", { 
      course, 
      year, 
      batch, 
      month, 
      currentYear,
      studentCount: students.length 
    });

    // Check for existing record
    let existingRecord = await Attendance.findOne({ course, year, batch, month });

    if (existingRecord) {
      console.log(`Updating existing attendance record for ${course}-${batch}-${month}-${year}`);

      // Update the record's currentYear
      existingRecord.currentYear = currentYear;

      // Process each student in the request
      students.forEach((newStudent) => {
        const existingStudent = existingRecord.students.find(
          s => s.regNumber === newStudent.regNumber
        );

        if (existingStudent) {
          // Update existing student
          existingStudent.currentYear = newStudent.currentYear;
          
          // Update attendance categories if they exist
          ["theory", "clinical", "practical"].forEach((type) => {
            if (newStudent[`${type}Total`] !== undefined) {
              existingStudent[type] = {
                total: Number(newStudent[`${type}Total`]) || 0,
                attended: Number(newStudent[`${type}Attended`]) || 0,
                percentage: newStudent[`${type}Total`] > 0 
                  ? ((newStudent[`${type}Attended`] / newStudent[`${type}Total`]) * 100).toFixed(2)
                  : "0.00"
              };
            }
          });
        } else {
          // Add new student
          const studentToAdd = {
            regNumber: newStudent.regNumber,
            name: newStudent.name,
            currentYear: newStudent.currentYear,
            theory: {
              total: Number(newStudent.theoryTotal) || 0,
              attended: Number(newStudent.theoryAttended) || 0,
              percentage: newStudent.theoryTotal > 0
                ? ((newStudent.theoryAttended / newStudent.theoryTotal) * 100).toFixed(2)
                : "0.00"
            },
            clinical: {
              total: Number(newStudent.clinicalTotal) || 0,
              attended: Number(newStudent.clinicalAttended) || 0,
              percentage: newStudent.clinicalTotal > 0
                ? ((newStudent.clinicalAttended / newStudent.clinicalTotal) * 100).toFixed(2)
                : "0.00"
            },
            practical: {
              total: Number(newStudent.practicalTotal) || 0,
              attended: Number(newStudent.practicalAttended) || 0,
              percentage: newStudent.practicalTotal > 0
                ? ((newStudent.practicalAttended / newStudent.practicalTotal) * 100).toFixed(2)
                : "0.00"
            }
          };
          existingRecord.students.push(studentToAdd);
        }
      });

      await existingRecord.save();
      return res.json({ 
        message: "Attendance updated successfully",
        recordId: existingRecord._id
      });
    } else {
      // Create new attendance record
      const newAttendance = new Attendance({
        course,
        year,
        batch,
        month,
        currentYear,
        students: students.map(student => ({
          regNumber: student.regNumber,
          name: student.name,
          currentYear: student.currentYear,
          theory: {
            total: Number(student.theoryTotal) || 0,
            attended: Number(student.theoryAttended) || 0,
            percentage: student.theoryTotal > 0
              ? ((student.theoryAttended / student.theoryTotal) * 100).toFixed(2)
              : "0.00"
          },
          clinical: {
            total: Number(student.clinicalTotal) || 0,
            attended: Number(student.clinicalAttended) || 0,
            percentage: student.clinicalTotal > 0
              ? ((student.clinicalAttended / student.clinicalTotal) * 100).toFixed(2)
              : "0.00"
          },
          practical: {
            total: Number(student.practicalTotal) || 0,
            attended: Number(student.practicalAttended) || 0,
            percentage: student.practicalTotal > 0
              ? ((student.practicalAttended / student.practicalTotal) * 100).toFixed(2)
              : "0.00"
          }
        }))
      });

      await newAttendance.save();
      return res.json({ 
        message: "Attendance saved successfully",
        recordId: newAttendance._id
      });
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ 
      message: "Error saving attendance", 
      error: error.message 
    });
  }
});


router.get("/average", async (req, res) => {
  try {
    const { course, batch, startMonth, endMonth, startYear, endYear } = req.query;

    if (!course || !batch || !startMonth || !endMonth || !startYear) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Default endYear to startYear if not provided (for same-year ranges)
    const endYearFinal = endYear || startYear;

    // Convert to numbers
    const startM = parseInt(startMonth, 10);
    const endM = parseInt(endMonth, 10);
    const startY = parseInt(startYear, 10);
    const endY = parseInt(endYearFinal, 10);

    // Find all relevant attendance records
    let records = [];
    
    if (startY === endY) {
      // Same year - simple range query
      records = await Attendance.find({
        course,
        batch,
        year: startY.toString(),
        month: { $gte: startM, $lte: endM }
      });
    } else {
      // Cross-year period - need multiple queries
      // First part: startYear (startMonth to December)
      const firstPart = await Attendance.find({
        course,
        batch,
        year: startY.toString(),
        month: { $gte: startM, $lte: 12 }
      });
      
      // Middle years: full years if any
      let middleParts = [];
      if (endY - startY > 1) {
        const middleYears = [];
        for (let y = startY + 1; y < endY; y++) {
          middleYears.push(y.toString());
        }
        middleParts = await Attendance.find({
          course,
          batch,
          year: { $in: middleYears }
        });
      }
      
      // Last part: endYear (January to endMonth)
      const lastPart = await Attendance.find({
        course,
        batch,
        year: endY.toString(),
        month: { $gte: 1, $lte: endM }
      });
      
      records = [...firstPart, ...middleParts, ...lastPart];
    }

    if (records.length === 0) {
      return res.status(404).json({ message: "No attendance records found for the selected range." });
    }

    // Rest of your existing calculation logic...
    let studentAttendanceMap = {};

    records.forEach((record) => {
      record.students.forEach((student) => {
        if (!studentAttendanceMap[student.regNumber]) {
          studentAttendanceMap[student.regNumber] = {
            regNumber: student.regNumber,
            name: student.name,
            totalTheory: 0,
            attendedTheory: 0,
            totalPractical: 0,
            attendedPractical: 0,
            totalClinical: 0,
            attendedClinical: 0,
            monthsCount: 0,
          };
        }

        studentAttendanceMap[student.regNumber].totalTheory += student.theory.total;
        studentAttendanceMap[student.regNumber].attendedTheory += student.theory.attended;
        studentAttendanceMap[student.regNumber].totalPractical += student.practical.total;
        studentAttendanceMap[student.regNumber].attendedPractical += student.practical.attended;
        studentAttendanceMap[student.regNumber].totalClinical += student.clinical.total;
        studentAttendanceMap[student.regNumber].attendedClinical += student.clinical.attended;
        studentAttendanceMap[student.regNumber].monthsCount += 1;
      });
    });

    const studentsAttendance = Object.values(studentAttendanceMap).map((student) => {
      let totalClasses = student.totalTheory + student.totalPractical + student.totalClinical;
      let totalAttended = student.attendedTheory + student.attendedPractical + student.attendedClinical;
      let averageAttendance = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(2) : "0.00";

      return {
        regNumber: student.regNumber,
        name: student.name,
        theoryPercentage: student.totalTheory ? ((student.attendedTheory / student.totalTheory) * 100).toFixed(2) : "0.00",
        practicalPercentage: student.totalPractical ? ((student.attendedPractical / student.totalPractical) * 100).toFixed(2) : "0.00",
        clinicalPercentage: student.totalClinical ? ((student.attendedClinical / student.totalClinical) * 100).toFixed(2) : "0.00",
        averageAttendance: averageAttendance,
      };
    });

    res.json(studentsAttendance);
  } catch (error) {
    console.error("Error fetching attendance averages:", error);
    res.status(500).json({ message: "Error fetching attendance", error: error.message });
  }
});

router.post("/save-averages", async (req, res) => {
  try {
    const { 
      course, 
      batch, 
      startMonth, 
      endMonth, 
      startYear, 
      endYear,
      averages 
    } = req.body;

    // Validate required fields
    if (!course || !batch || !startMonth || !endMonth || !startYear || !endYear || !averages) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Check if this average already exists
    const existingAverage = await AverageAttendance.findOne({
      course,
      batch,
      startMonth,
      endMonth,
      startYear,
      endYear
    });

    if (existingAverage) {
      // Update existing record
      existingAverage.averages = averages;
      existingAverage.calculatedAt = new Date();
      await existingAverage.save();
      return res.json({ 
        message: "Average attendance updated successfully",
        id: existingAverage._id
      });
    } else {
      // Create new record
      const newAverage = new AverageAttendance({
        course,
        batch,
        startMonth,
        endMonth,
        startYear,
        endYear,
        averages,
        calculatedAt: new Date()
      });

      await newAverage.save();
      return res.json({ 
        message: "Average attendance saved successfully",
        id: newAverage._id
      });
    }
  } catch (error) {
    console.error("Error saving averages:", error);
    res.status(500).json({ 
      message: "Error saving average attendance", 
      error: error.message 
    });
  }
});
export default router;
