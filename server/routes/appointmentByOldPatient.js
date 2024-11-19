const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const Config = require("../models/configSchema");
const generateTimeSlots = require("../utils/slots");

router.post(
  "/appointmentByOldPatient/:patientId",

  async (req, res) => {
    const { patientId } = req.params;
    const { appointmentInfo } = req.body;
    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the patient and check if they exist
      const patient = await Patient.findOne({ patientId }).session(session);
      if (!patient) {
        return res.status(400).json({ message: "Patient doesn't exists" });
      }

      // Find the last visit for the patient to determine the visit number
      const lastAppointment = await Appointment.findOne({ patientId })
        .sort({ appointmentNumber: -1 })
        .session(session);
      const appointmentNumber = lastAppointment
        ? lastAppointment.appointmentNumber + 1
        : 1;

      // Check last appointment to cancel it if its status is scheduled
      if (lastAppointment && lastAppointment.status === "scheduled") {
        lastAppointment.status = "cancelled";
        await lastAppointment.save({ session });
      }

      // Extract appointment info from request body
      const { appointmentTime, type } = appointmentInfo;

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
      // Create a new appointment for the patient
      const newAppointment = new Appointment({
        patientId,
        appointmentTime: appointmentTime.trim(),
        type,
        status: "scheduled",
        appointmentNumber,
      });

      const savedAppointment = await newAppointment.save({ session });

      // Commit the transaction if all operations are successful
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        patient: patient,
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
