const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Patient = require("../models/patientSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const Appointment = require("../models/appointmentSchema");
const Config = require("../models/configSchema");
const generateTimeSlots = require("../utils/slots");
const Fees = require("../models/feesSchema");

exports.newPatientMedicalInfo = async (req, res) => {
  const { patientId } = req.params;
  const { appointmentInfo, medicalInfo, isOnlinePatient, feesInfo } = req.body;

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  let savedAppointment; // Define savedAppointment outside the if-else blocks
  let appointmentNumber; // Define savedNumber outside the if-else blocks

  try {
    // Find the patient and check if they exist
    const patient = await Patient.findOne({ patientId }).session(session);
    if (!patient) {
      return res.status(400).json({
        message: "Patient not found.",
      });
    }

    // Find the last appointment to determine visit number
    const lastAppointment = await Appointment.findOne({ patientId })
      .sort({ appointmentNumber: -1 })
      .session(session);

    // If patient type is not online, check for appointment slot validation and create new appointment
    if (!isOnlinePatient) {
      // Inc the appointment number
      appointmentNumber = lastAppointment
        ? lastAppointment.appointmentNumber + 1
        : 1;

      // Check if there's a scheduled appointment and cancel it
      if (lastAppointment && lastAppointment.status === "scheduled") {
        lastAppointment.status = "cancelled";
        await lastAppointment.save({ session });
      }

      // Extract appointment info from request body
      const { appointmentTime, type, isSpecialSlot } = appointmentInfo;

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
        appointmentNumber,
      });

      savedAppointment = await newAppointment.save({ session });
    } else {
      // For online patients, fetch the last appointment (no new appointment creation)
      appointmentNumber = lastAppointment
        ? lastAppointment.appointmentNumber
        : 1;

      // Check if a medical record already exists for the current visit
      const duplicateMedicalRecord = await PatientMedicalInfo.findOne({
        patientId,
        appointmentNumber,
      }).session(session);

      if (duplicateMedicalRecord) {
        throw new Error(
          `Medical record already exists for Appointment Number ${appointmentNumber}. Cancel old Appointment to create New`
        );
      }
      savedAppointment = lastAppointment; // Simply use the last appointment for online patients
    }

    // Create new fees information
    const newFeesInfo = new Fees({
      patientId,
      appointmentNumber,
      ...req.body.feesInfo,
    });
    const savedFeesInfo = await newFeesInfo.save({ session });

    // Create a new medical info record
    const newMedicalInfo = new PatientMedicalInfo({
      patientId,
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
      feesInfo: savedFeesInfo,
      message:
        "Patient medical and fees info added successfully, and appointment booked.",
    });
  } catch (error) {
    // Rollback the transaction in case of any error
    await session.abortTransaction();
    session.endSession();
    console.error("Error occurred:", error);
    res.status(400).json({ message: error.message });
  }
};
