// routes/patients.js
import express from "express";
import Patient from "../models/Patient.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all patients (for faculty)
router.get("/", authenticateUser, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient status (mark complete/incomplete)
router.patch("/:id", authenticateUser, async (req, res) => {
  try {
    const { isCompleted, facultyComments } = req.body;
    
    const updateData = { 
      isCompleted,
      facultyComments,
      reviewedBy: req.user._id,
      reviewedAt: new Date()
    };

    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate dummy data (for testing)
router.post("/generate-dummy-data", authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can generate dummy data" });
    }

    const count = req.body.count || 10;
    const dummyPatients = await Patient.generateDummyData(count);
    res.status(201).json({
      message: `Generated ${dummyPatients.length} dummy patient records`,
      patients: dummyPatients
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;