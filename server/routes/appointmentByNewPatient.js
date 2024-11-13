const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const getNextPatientID = require("../utils/patientID");

router.post(
  "/appointmentByNewPatient",

  async (req, res) => {
    const { appointmentInfo, personalInfo } = req.body;
    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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
      const { appointmentDateTime, type } = appointmentInfo;
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0); // Start of the current day
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999); // End of the current day

      // Check if the slot is already booked on the current day
      const existingAppointment = await Appointment.findOne({
        appointmentDateTime: appointmentDateTime.trim(),
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
        appointmentDateTime: appointmentDateTime.trim(),
        type,
        status: "scheduled",
        visitNumber: 1,
      });
      const savedAppointment = await newAppointment.save({ session });

      // Create new patient data with the generated patient ID
      const newPatient = new Patient({
        ...req.body.personalInfo,
        patientId,
      });
      const savedPatient = await newPatient.save({ session });

      // Commit the transaction if all operations are successful
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        patient: savedPatient,
        appointment: savedAppointment,
        message: "Patient appointment booked.",
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
