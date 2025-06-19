const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  // Personal Information
  patientId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  birthYear: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },

  // Additional Information
  allergies: { type: String },
  chronicConditions: { type: String },
  assistedBy: {
    name: { type: String },
    email: { type: String },
    role: { type: String },
    id: { type: String },
  },

  createdAt: { type: Date, default: Date.now, required: true },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
