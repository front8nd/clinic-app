const express = require("express");
const router = express.Router();
const Patient = require("../models/patientSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const authMiddleware = require("../middleware/auth");
const getNextPatientID = require("../utils/patientID");

// POST /patients/newPatientProfile - Create a new patient profile
router.post("/newPatientProfile", authMiddleware, async (req, res) => {
  try {
    // Generate a sequential patient ID
    const patientId = await getNextPatientID();

    // Check if patientId already exists (rare case)
    const existingPatient = await Patient.findOne({ patientId });
    if (existingPatient) {
      return res
        .status(409)
        .json({ message: "Patient ID conflict. Please try again." });
    }

    // Create new patient data with the generated patient ID
    const newPatient = new Patient({
      ...req.body.personalInfo, // Use personal info from request body
      patientId,
    });

    // Save the new patient profile to the database
    const savedPatient = await newPatient.save();

    // Create new medical information using the generated patient ID
    const newMedicalInfo = new PatientMedicalInfo({
      patientId,
      visitNumber: 1, // First visit
      ...req.body.medicalInfo,
    });

    // Save the medical information to the database
    const savedMedicalInfo = await newMedicalInfo.save();

    // Respond with the created patient and medical info
    res.status(201).json({
      patient: savedPatient,
      medicalInfo: savedMedicalInfo,
      message: "Patient profile and initial medical info added successfully.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    } else {
      return res
        .status(500)
        .json({ message: "Server error", details: error.message });
    }
  }
});

module.exports = router;
