const mongoose = require("mongoose");

// Updated Patient Schema
const PatientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true }, // Unique patient identifier
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  contact: { type: String, required: true },
  address: { type: String },
  allergies: [{ type: String }], // Array for multiple allergies
  chronicConditions: [{ type: String }], // Array for chronic conditions
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    contactNumber: { type: String },
  },
  medicalHistory: [
    {
      condition: { type: String },
      dateDiagnosed: { type: Date },
      notes: { type: String },
    },
  ],
  assistedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const PatientModel = mongoose.model("Patient", PatientSchema);

module.exports = { PatientModel };
