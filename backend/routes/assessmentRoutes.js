import express from "express";
import Student from "../models/Student.js";
import Assessment from "../models/Assessment.js";

const router = express.Router();

// Improved function to calculate the student's current year from the batch
const getCurrentYear = (batch) => {
    if (!batch) return "";
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0
    
    const batchStartYear = parseInt(batch.split("-")[0]);
    
    // Academic year starts in July (month 7)
    // If current month is before July, we're still in the previous academic year
    const academicYear = currentMonth < 7 ? currentYear - 1 : currentYear;
    
    const year = academicYear - batchStartYear + 1;
    
    if (year < 1) return "Not Started";
    if (year > 5) return "Graduated";
    
    // Add ordinal suffix (1st, 2nd, 3rd, etc.)
    const suffixes = ["th", "st", "nd", "rd"];
    const suffix = year % 100 > 10 && year % 100 < 14 ? "th" : suffixes[year % 10] || "th";
    
    return `${year}${suffix} Year`;
};

// Fetch students along with their assessments
router.get("/", async (req, res) => {
    const { course, batch, assessmentType } = req.query;
    try {
        const students = await Student.find({ course, batch });

        const studentData = await Promise.all(students.map(async (student) => {
            const assessment = await Assessment.findOne({ regNumber: student.regNumber, assessmentType });

            return {
                regNumber: student.regNumber,
                name: student.name,
                year: getCurrentYear(student.batch),
                assessmentType: assessment ? assessment.assessmentType : "",
                theory70: assessment?.theory70 || 0,
                theory20: assessment?.theory20 || 0,
                theory10: assessment?.theory10 || 0,
                totalTheory: 
                    (assessment?.theory70 || 0) + 
                    (assessment?.theory20 || 0) + 
                    (assessment?.theory10 || 0),
                practical90: assessment?.practical90 || 0,
                practical10: assessment?.practical10 || 0,
                totalPractical: 
                    (assessment?.practical90 || 0) + 
                    (assessment?.practical10 || 0)
            };
        }));

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
});

// Save assessment data
// Save assessment data
router.post("/save", async (req, res) => {
    try {
        const { regNumber, assessmentType, theory70, theory20, theory10, practical90, practical10 } = req.body;

        // Fetch student details for name and batch
        const student = await Student.findOne({ regNumber });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const year = getCurrentYear(student.batch);
        const totalTheory = (theory70 || 0) + (theory20 || 0) + (theory10 || 0);
        const totalPractical = (practical90 || 0) + (practical10 || 0);

        // Update or insert assessment record
        const assessment = await Assessment.findOneAndUpdate(
            { regNumber, assessmentType },
            { 
                name: student.name, 
                year,
                course: student.course,  // Added course
                batch: student.batch,    // Added batch
                theory70, 
                theory20, 
                theory10, 
                totalTheory, 
                practical90, 
                practical10, 
                totalPractical 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Assessment saved successfully", assessment });
    } catch (error) {
        res.status(500).json({ message: "Error saving assessment" });
    }
});
export default router;