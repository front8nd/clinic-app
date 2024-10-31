const mongoose = require("mongoose");

// Updated Visit Schema
const VisitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visitNumber: { type: Number }, // Tracks the number of visits
  visitType: { type: String, enum: ["initial", "follow-up", "emergency"] }, // Type of visit
  date: { type: Date, default: Date.now },
  diagnosis: {
    primary: { type: String },
    secondary: { type: String },
    notes: { type: String },
  },
  vitalSigns: {
    // Capture patient vital signs
    bloodPressure: { type: String },
    heartRate: { type: Number },
    temperature: { type: Number },
    respiratoryRate: { type: Number },
  },
  prescription: [
    {
      medicationName: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      startDate: { type: Date }, // When the medication starts
      endDate: { type: Date }, // When the medication ends
      additionalInstructions: { type: String },
    },
  ],
  notes: { type: String },
  followUpDate: { type: Date },
});

const VisitModel = mongoose.model("Visit", VisitSchema);
module.exports = { VisitModel };
