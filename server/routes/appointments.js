const express = require("express");
const Appointment = require("../models/appointmentSchema");
const Patient = require("../models/patientSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Patient - Get all patients with optional date filtering and pagination

router.get("/appointments", authMiddleware, async (req, res) => {
  const { date } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    // Build filter for date if provided
    const filter = {};
    if (date) {
      const selectedDate = new Date(date);
      filter.createdAt = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)), // End of the day
      };
    }

    // Calculate total count for pagination
    const totalAppointments = await Appointment.countDocuments(filter);
    const totalPages = limit ? Math.ceil(totalAppointments / limit) : 1;
    const skip = (page - 1) * limit;

    // Retrieve appointments with filtering and pagination
    const AppointmentList = await Appointment.find(filter)
      .skip(skip)
      .limit(limit);

    if (AppointmentList.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    // Fetch unique patient IDs from the appointments
    const patientIds = [
      ...new Set(AppointmentList.map((appointment) => appointment.patientId)),
    ];
    const patients = await Patient.find({ patientId: { $in: patientIds } });

    // Create a mapping of patientId to patient object
    const patientMap = patients.reduce((acc, patient) => {
      acc[patient.patientId] = patient; // Assuming patient.patientId is the ID
      return acc;
    }, {});

    // Prepare response data by combining appointments with corresponding patient data
    const appointmentsWithPatients = AppointmentList.map((appointment) => ({
      ...appointment._doc, // Use the appointment document properties
      patient: patientMap[appointment.patientId] || null, // Attach patient object or null if not found
    }));

    res.status(200).json({
      message: "Appointments retrieved successfully.",
      totalAppointments,
      totalPages,
      currentPage: page,
      appointments: appointmentsWithPatients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
