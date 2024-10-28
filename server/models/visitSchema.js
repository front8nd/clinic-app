// Updated Visit Schema
const mongoose = require("mongoose");

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
  date: { type: Date, default: Date.now },
  diagnosis: { type: String },
  prescription: [
    {
      medicationName: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      additionalInstructions: { type: String },
    },
  ],
  notes: { type: String },
  followUpDate: { type: Date },
});

const VisitModel = mongoose.model("patient", VisitSchema);
module.exports = VisitModel;
