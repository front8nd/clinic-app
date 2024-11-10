const express = require("express");
const router = express.Router();
const Patient = require("../models/patientSchema");
const authMiddleware = require("../middleware/auth");
const Visit = require("../models/visitSchema");
const Appointment = require("../models/appointmentSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");

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
      // Retrieve all appointments associated with the patient using the unique patientId
      const appointments = await Appointment.find({ patientId }).sort({
        visitNumber: -1,
      });

      // Retrieve all visits associated with the patient using the unique patientId
      const visits = await Visit.find({ patientId });

      // Retrieve all medical information associated with the patient
      const medicalInfo = await PatientMedicalInfo.find({ patientId }).sort({
        visitNumber: -1,
      });

      // Return the patient profile, visits, and medical info
      res.status(200).json({
        patient,
        visits,
        medicalInfo,
        appointments,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
