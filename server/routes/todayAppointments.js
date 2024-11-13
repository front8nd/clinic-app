const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointmentSchema");
const authMiddleware = require("../middleware/auth");
const generateTimeSlots = require("../utils/slots");

// API to get today's appointment slots and availability
router.get("/today-appointments", async (req, res) => {
  try {
    // Get today's date range (start and end of the current day)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to start of day
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set to end of day

    // Query for today's appointments with status 'scheduled' or 'completed'
    const appointments = await Appointment.find({
      createdAt: { $gte: todayStart, $lte: todayEnd }, // Check for today's date range
      status: { $in: ["scheduled", "completed"] }, // Include both statuses
    }).select("appointmentDateTime");

    // Generate all possible slots for today
    const allSlots = generateTimeSlots();

    // Convert appointment times from the database into a set
    const bookedSlots = new Set(
      appointments.map((appt) => appt.appointmentDateTime.trim()) // Match exact time string
    );

    // Mark slots as available or occupied
    const slotsWithAvailability = allSlots.map((slot) => ({
      time: slot,
      available: !bookedSlots.has(slot), // If the slot is in the bookedSlots set, mark it as unavailable
    }));

    res.status(200).json({
      date: new Date().toLocaleDateString(),
      slots: slotsWithAvailability, // Return the slots with availability status
    });
  } catch (error) {
    console.error("Error generating today's appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
