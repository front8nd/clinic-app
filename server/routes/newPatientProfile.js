const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Patient = require("../models/patientSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const authMiddleware = require("../middleware/auth");
const getNextPatientID = require("../utils/patientID");

// POST /patients/newPatientProfile - Create a new patient profile
router.post("/newPatientProfile", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Generate a sequential patient ID
    const patientId = await getNextPatientID(session);

    // Check if patientId already exists
    const existingPatient = await Patient.findOne({ patientId }).session(
      session
    );
    if (existingPatient) {
      await session.abortTransaction();
      return res
        .status(409)
        .json({ message: "Patient ID conflict. Please try again." });
    }

    // Create new patient data with the generated patient ID
    const newPatient = new Patient({
      ...req.body.personalInfo,
      patientId,
    });
    const savedPatient = await newPatient.save({ session });

    // Create new medical information using the generated patient ID
    const newMedicalInfo = new PatientMedicalInfo({
      patientId,
      visitDate: new Date(),
      visitNumber: 1,
      ...req.body.medicalInfo,
    });
    const savedMedicalInfo = await newMedicalInfo.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Respond with the created patient and medical info
    res.status(201).json({
      patient: savedPatient,
      medicalInfo: savedMedicalInfo,
      message: "Patient profile and initial medical info added successfully.",
    });
  } catch (error) {
    await session.abortTransaction(); // Roll back the transaction on error
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    } else {
      return res
        .status(500)
        .json({ message: "Server error", details: error.message });
    }
  } finally {
    session.endSession(); // Ensure the session is closed
  }
});

module.exports = router;
