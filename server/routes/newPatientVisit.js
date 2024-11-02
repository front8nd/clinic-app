// routes/visitRoutes.js
const express = require("express");
const { VisitModel } = require("../models/visitSchema");
const { PatientModel } = require("../models/patientSchema");
const { UserModel } = require("../models/userSchema"); // Assuming you have a User model for doctors
const authMiddleware = require("../middleware/auth");

const router = express.Router();

//  Create a new visit for a patient
router.post("/newPatientVisit/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params;
  const {
    doctorId,
    visitType,
    diagnosis,
    vitalSigns,
    prescription,
    notes,
    followUpDate,
  } = req.body;

  try {
    // Validate that the patient exists
    const patient = await PatientModel.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Validate that the doctor exists
    const doctor = await UserModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Find the last visit for the patient to determine the visit number
    const lastVisit = await VisitModel.findOne({ patientId }).sort({
      visitNumber: -1,
    });
    const visitNumber = lastVisit ? lastVisit.visitNumber + 1 : 1; // Increment or set to 1

    // Create a new visit record
    const newVisit = new VisitModel({
      patientId,
      doctorId,
      visitNumber,
      visitType,
      diagnosis,
      vitalSigns,
      prescription,
      notes,
      followUpDate,
    });

    // Save the visit to the database
    const savedVisit = await newVisit.save();
    res.status(201).json(savedVisit); // Sends back the created visit record
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
