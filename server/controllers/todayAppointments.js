const Appointment = require("../models/appointmentSchema");
const Config = require("../models/configSchema");
const generateTimeSlots = require("../utils/slots");

// API to get today's appointment slots and availability
exports.TodayAppointments = async (req, res) => {
  try {
    // Get today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Query for today's appointments
    const appointments = await Appointment.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ["scheduled", "completed"] },
    }).select("appointmentTime");

    // Get Appointment Config
    const appointmentConfig = await Config.findOne({});
    if (!appointmentConfig) {
      return res
        .status(500)
        .json({ message: "Appointment configuration not found" });
    }

    // Generate all possible slots for today
    const allSlots = generateTimeSlots(appointmentConfig);

    // Create a Map to track counters for each slot
    const slotCounters = new Map();

    // Initialize the Map with all slot time ranges and default counter
    allSlots.forEach((slot) => {
      slotCounters.set(slot.timeRange, 0); // Default counter
    });

    // Increment counters in the Map based on appointments
    appointments.forEach((appt) => {
      const timeRange = appt.appointmentTime.trim();
      if (slotCounters.has(timeRange)) {
        slotCounters.set(timeRange, slotCounters.get(timeRange) + 1);
      }
    });

    // Build the response with accurate counters
    const slotsWithAvailability = allSlots.map((slot) => {
      const currentCounter = slotCounters.get(slot.timeRange) || 0;
      return {
        time: {
          ...slot,
          counter: currentCounter, // Include the accurate counter
        },
        available: currentCounter < slot.maxSlots, // Availability based on counter
      };
    });

    res.status(200).json({
      date: new Date().toLocaleDateString(),
      slots: slotsWithAvailability,
    });
  } catch (error) {
    console.error("Error generating today's appointments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
