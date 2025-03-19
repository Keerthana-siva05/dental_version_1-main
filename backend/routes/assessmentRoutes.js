import express from "express";
import Student from "../models/Student.js";
import Assessment from "../models/Assessment.js";

const router = express.Router();

// Function to calculate the student's current year from the batch
const getCurrentYear = (batch) => {
    const currentYear = new Date().getFullYear();
    const batchStartYear = parseInt(batch.split("-")[0]); // Extracts starting year
    const year = currentYear - batchStartYear + 1;
    return year > 5 ? "Graduated" : `${year} Year`;
};

// Fetch students along with their assessments
router.get("/", async (req, res) => {
    const { course, batch, assessmentType } = req.query;
    try {
        const students = await Student.find({ course, batch });

        const studentData = await Promise.all(students.map(async (student) => {
            const assessment = await Assessment.findOne({ regNumber: student.regNumber, assessmentType });

            // If assessment type is changed, reset marks fields
            const resetMarks = {
                theory70: "",
                theory20: "",
                theory10: "",
                totalTheory: "",
                practical90: "",
                practical10: "",
                totalPractical: "",
            };

            return {
                regNumber: student.regNumber,
                name: student.name,
                year: getCurrentYear(student.batch),
                assessmentType: assessment ? assessment.assessmentType : "",
                ...(!assessment ? resetMarks : { // If no assessment found, reset marks
                    theory70: assessment.theory70 || "",
                    theory20: assessment.theory20 || "",
                    theory10: assessment.theory10 || "",
                    totalTheory: assessment.totalTheory || "",
                    practical90: assessment.practical90 || "",
                    practical10: assessment.practical10 || "",
                    totalPractical: assessment.totalPractical || ""
                })
            };
        }));

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students" });
    }
});


// Save assessment data
router.post("/save", async (req, res) => {
    try {
        const { regNumber, assessmentType, theory70, theory20, theory10, practical90, practical10 } = req.body;

        // Fetch student details for name and batch
        const student = await Student.findOne({ regNumber });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const year = getCurrentYear(student.batch); // Calculate student's year
        const totalTheory = (theory70 || 0) + (theory20 || 0) + (theory10 || 0);
        const totalPractical = (practical90 || 0) + (practical10 || 0);

        // Update or insert assessment record
        const assessment = await Assessment.findOneAndUpdate(
            { regNumber, assessmentType },
            { name: student.name, year, theory70, theory20, theory10, totalTheory, practical90, practical10, totalPractical },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Assessment saved successfully", assessment });
    } catch (error) {
        res.status(500).json({ message: "Error saving assessment" });
    }
});

export default router;
