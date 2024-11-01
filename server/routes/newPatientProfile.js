const express = require("express");
const Patient = require("../models/patientSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// POST /patients - Create a new patient profile
router.post("/newPatientProfile", authMiddleware, async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient); // Sends back patient profile, including `patientId`
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
