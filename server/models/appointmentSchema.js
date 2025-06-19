const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Patient",
    required: true,
  },

  appointmentNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },

  appointmentTime: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["online", "offline"],
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
  },
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);
module.exports = AppointmentModel;
