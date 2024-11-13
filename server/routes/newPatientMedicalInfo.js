const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = require("../models/patientSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const authMiddleware = require("../middleware/auth");
const Appointment = require("../models/appointmentSchema");

router.post(
  "/newPatientMedicalInfo/:patientId",
  authMiddleware,
  async (req, res) => {
    const { patientId } = req.params;
    const { appointmentInfo, medicalInfo } = req.body;

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the patient and check if they exist
      const patient = await Patient.findOne({ patientId }).session(session);
      if (!patient) {
        return res.status(400).json({
          message: "Patient not found.",
        });
      }

      // Find the last visit to determine visit number
      const lastAppointment = await Appointment.findOne({ patientId })
        .sort({ appointmentNumber: -1 })
        .session(session);
      const appointmentNumber = lastAppointment
        ? lastAppointment.appointmentNumber + 1
        : 1;

      // Extract appointment info from request body
      const { appointmentTime, type } = appointmentInfo;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Start of the current day
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // End of the current day

      // Check if the slot is already booked on the current day
      const existingAppointment = await Appointment.findOne({
        appointmentTime: appointmentTime.trim(), // Ensure comparison is precise
        status: { $in: ["scheduled", "completed"] },
        createdAt: { $gte: todayStart, $lte: todayEnd },
      }).session(session);

      if (existingAppointment) {
        await session.abortTransaction();
        return res.status(409).json({
          message: "The selected appointment slot is already booked for today.",
        });
      }

      // Create a new appointment for the patient
      const newAppointment = new Appointment({
        patientId,
        appointmentTime: appointmentTime.trim(),
        type,
        status: "scheduled",
        appointmentNumber,
      });

      const savedAppointment = await newAppointment.save({ session });

      // Create a new medical info record
      const newMedicalInfo = new PatientMedicalInfo({
        patientId,
        visitDate: new Date(),
        appointmentNumber,
        ...medicalInfo,
      });

      const savedMedicalInfo = await newMedicalInfo.save({ session });

      // Commit the transaction if all operations are successful
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        medicalInfo: savedMedicalInfo,
        appointment: savedAppointment,
        message:
          "Patient medical info added successfully, and appointment booked.",
      });
    } catch (error) {
      // Rollback the transaction in case of any error
      await session.abortTransaction();
      session.endSession();
      console.error("Error occurred:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
