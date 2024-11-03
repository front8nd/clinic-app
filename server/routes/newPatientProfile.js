const express = require("express");
const Patient = require("../models/patientSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const getNextPatientID = require("../utils/patientID");

// POST /patients - Create a new patient profile
router.post("/newPatientProfile", authMiddleware, async (req, res) => {
  try {
    // Generate a sequential patient ID
    const patientId = await getNextPatientID();

    // Create new patient data with the generated patient ID
    const newPatient = new Patient({
      ...req.body,
      patientId: patientId,
    });

    // Send back patient data
    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
