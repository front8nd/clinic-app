const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  // Personal Information
  patientId: { type: String, unique: true }, // Unique patient identifier
  name: { type: String, required: true },
  birthYear: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  contact: { type: String },
  address: { type: String },

  // Additional Information
  allergies: { type: String },
  chronicConditions: { type: String },
  assistedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
