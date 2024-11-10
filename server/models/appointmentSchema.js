const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Patient",
    required: true,
  },

  visitNumber: { type: Number, required: true },

  appointmentDateTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
module.exports = AppointmentModel;
