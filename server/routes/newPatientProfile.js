const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const authMiddleware = require("../middleware/auth");
const getNextPatientID = require("../utils/patientID");
const Config = require("../models/configSchema");
const generateTimeSlots = require("../utils/slots");

// POST /patients/newPatientProfile - Create a new patient profile and book an appointment
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

    // Extract appointment info from request body
    const { appointmentTime, type, isSpecialSlot } = req.body.appointmentInfo;

    // Incase of extending slots
    if (!isSpecialSlot) {
      // Fetch today's slots dynamically
      const appointmentConfig = await Config.findOne({});
      if (!appointmentConfig) {
        throw new Error("Appointment configuration not found.");
      }
      const allSlots = generateTimeSlots(appointmentConfig);

      // Validate appointmentTime against the slots
      const matchingSlot = allSlots.find(
        (slot) => slot.timeRange === appointmentTime
      );

      if (!matchingSlot) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Invalid appointment time. Please select a valid slot.",
        });
      }

      // Check if the slot is already fully booked
      const existingAppointments = await Appointment.countDocuments({
        appointmentTime,
        status: { $in: ["scheduled", "completed"] },
        createdAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999),
        },
      }).session(session);

      if (existingAppointments >= matchingSlot.maxSlots) {
        await session.abortTransaction();
        return res.status(409).json({
          message: `The selected slot '${appointmentTime}' is fully booked. Please choose another time.`,
        });
      }
    }

    // Create a new appointment for the patient
    const newAppointment = new Appointment({
      patientId,
      appointmentTime: appointmentTime.trim(),
      type,
      status: "scheduled",
      appointmentNumber: 1,
    });
    const savedAppointment = await newAppointment.save({ session });

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
      appointmentNumber: 1,
      ...req.body.medicalInfo,
    });
    const savedMedicalInfo = await newMedicalInfo.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Respond with the created patient and medical info
    res.status(201).json({
      patient: savedPatient,
      medicalInfo: savedMedicalInfo,
      appointment: savedAppointment,
      message:
        "Patient profile and initial medical info added successfully, and appointment booked.",
    });
  } catch (error) {
    await session.abortTransaction(); // Roll back the transaction on error
    console.error(
      "Error creating new patient profile and booking appointment:",
      error
    );
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
