const express = require("express");
const Visit = require("../models/visitSchema");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new visit for a patient
router.post("/newPatientVisit/:patientId", authMiddleware, async (req, res) => {
  const { patientId } = req.params; // Use patientId as a String

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate that the patient exists using patientId as a String
    const patient = await Patient.findOne({ patientId }).session(session);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find the last appointment for the patient to determine the appointment number
    const lastAppointment = await Appointment.findOne({ patientId })
      .sort({
        appointmentNumber: -1,
      })
      .session(session);
    const appointmentNumber = lastAppointment
      ? lastAppointment.appointmentNumber + 1
      : 1;

    // Based on the appointment number, mark the appointment as completed
    const appointmentToUpdate = await Appointment.findOne({
      patientId,
      appointmentNumber,
      status: { $ne: "completed" },
    }).session(session);

    if (appointmentToUpdate) {
      appointmentToUpdate.status = "completed";
      await appointmentToUpdate.save({ session });
    }

    // Create a new visit record
    const newVisit = new Visit({
      patientId,
      appointmentNumber,
      ...req.body,
    });

    // Save the new visit record within the session
    const savedVisit = await newVisit.save({ session });

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message:
        "Visit created and appointment marked as completed if applicable.",
      visit: savedVisit,
      updatedAppointment: appointmentToUpdate,
    });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
