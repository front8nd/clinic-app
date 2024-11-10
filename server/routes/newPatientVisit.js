const express = require("express");
const Visit = require("../models/visitSchema");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create a new visit for a patient
router.post("/newPatientVisit/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params; // Use patientId as a String
  try {
    // Validate that the patient exists using patientId as a String
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find the last visit for the patient to determine the visit number
    const lastVisit = await Visit.findOne({ patientId }).sort({
      visitNumber: -1,
    });
    const visitNumber = lastVisit ? lastVisit.visitNumber + 1 : 1; // Increment or set to 1

    // Based on the visit number, mark the appointment as completed
    const appointmentToUpdate = await Appointment.findOne({
      patientId,
      visitNumber,
      status: { $ne: "completed" },
    });

    if (appointmentToUpdate) {
      appointmentToUpdate.status = "completed";
      await appointmentToUpdate.save(); // Save the updated appointment status
    }

    // Create a new visit record
    const newVisit = new Visit({
      patientId,
      visitNumber,
      ...req.body,
    });

    // Save the visit to the database
    const savedVisit = await newVisit.save();
    res.status(201).json({
      message:
        "Visit created and appointment marked as completed if applicable.",
      visit: savedVisit,
      updatedAppointment: appointmentToUpdate,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
