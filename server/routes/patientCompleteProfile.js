const express = require("express");
const Patient = require("../models/patientSchema");
const Visit = require("../models/visitSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Get a specific patient profile with all visits and medical info
router.get(
  "/patientCompleteProfile/:patientId",
  authMiddleware,
  async (req, res) => {
    const { patientId } = req.params; // Get patientId from the URL parameters
    try {
      // Find the patient by patientId as a String
      const patient = await Patient.findOne({ patientId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found." });
      }

      // Retrieve all visits associated with the patient using the unique patientId
      const visits = await Visit.find({ patientId }).populate(
        "doctorId",
        "name"
      );

      // Retrieve all medical information associated with the patient
      const medicalInfo = await PatientMedicalInfo.find({ patientId }).sort({
        visitDate: -1,
      });

      // Return the patient profile, visits, and medical info
      res.status(200).json({
        patient,
        visits,
        medicalInfo,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
