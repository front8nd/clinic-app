const mongoose = require("mongoose");

// Updated Patient Schema
const PatientSchema = new mongoose.Schema({
  // Personal Information
  patientId: { type: String, unique: true }, // Unique patient identifier
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"] },
  contact: { type: String },
  address: { type: String },

  // Medical Information

  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  weight: { type: String, required: true },
  blood_pressure: { type: String },
  allergies: { type: String },
  chronicConditions: { type: String },

  assistedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const patientModel = mongoose.model("Patient", PatientSchema);

module.exports = patientModel;
