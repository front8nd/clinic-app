const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = require("../models/patientSchema");
const Appointment = require("../models/appointmentSchema");
const getNextPatientID = require("../utils/patientID");

router.post("/appointmentByNewPatient", async (req, res) => {
  const { appointmentInfo, personalInfo } = req.body;

  // Validate request body
  if (!appointmentInfo || !personalInfo) {
    return res.status(400).json({ message: "Missing required information." });
  }

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
      session.endSession();
      return res
        .status(409)
        .json({ message: "Patient ID conflict. Please try again." });
    }

    // Extract and validate appointment info
    const { appointmentTime, type } = appointmentInfo;
    const sanitizedAppointmentTime = appointmentTime.trim();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if the slot is already booked on the current day
    const existingAppointment = await Appointment.findOne({
      appointmentTime: sanitizedAppointmentTime,
      status: { $in: ["scheduled", "completed"] },
      createdAt: { $gte: todayStart, $lte: todayEnd },
    }).session(session);

    if (existingAppointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        message: "The selected appointment slot is already booked for today.",
      });
    }

    // Create a new appointment for the patient
    const newAppointment = new Appointment({
      patientId,
      appointmentTime: sanitizedAppointmentTime,
      type,
      status: "scheduled",
      appointmentNumber: 1,
    });
    const savedAppointment = await newAppointment.save({ session });

    // Create new patient data with the generated patient ID
    const newPatient = new Patient({
      name: personalInfo.name,
      address: personalInfo.address,
      contact: personalInfo.contact,
      gender: personalInfo.gender,
      birthYear: personalInfo.birthYear, // ...personalInfo will also work, but personalInfo will not work as it is a object while spread operator extract the object
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
    res
      .status(400)
      .json({ message: "An error occurred while processing the request." });
  }
});

module.exports = router;