// Patient Schema
const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  contact: { type: String, required: true },
  address: { type: String },
  medicalHistory: { type: String },
  staffName: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to staff who registered the patient
  createdAt: { type: Date, default: Date.now },
});

const PatientModel = mongoose.model("patient", PatientSchema);
module.exports = PatientModel;
