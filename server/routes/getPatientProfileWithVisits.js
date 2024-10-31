const express = require("express");
const Patient = require("../models/patientSchema");
const Visit = require("../models/visitSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Get a specific patient profile with all visits
router.get("/patients/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params; // Get patientId from the URL parameters

  try {
    // Find the patient by ID
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Retrieve all visits associated with the patient
    const visits = await Visit.find({ patientId }).populate("doctorId", "name"); // Populate doctor name only

    // Return the patient profile and visits
    res.status(200).json({
      patient,
      visits,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
