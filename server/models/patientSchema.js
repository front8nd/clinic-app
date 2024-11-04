const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  // Personal Information
  patientId: { type: String, unique: true, required: true }, // Unique patient identifier
  name: { type: String, required: true },
  birthYear: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },

  // Additional Information
  allergies: { type: String, required: true },
  chronicConditions: { type: String, required: true },
  assistedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
  },

  createdAt: { type: Date, default: Date.now, required: true },
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = Patient;
