const mongoose = require("mongoose");

// Updated Visit Schema with improvements
const VisitSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Patient",
    required: true,
  },
  doctor: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
  },

  // Visit details
  appointmentNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },

  visitType: {
    type: String,
    enum: ["initial", "follow-up", "emergency"],
    required: true,
  },

  // Diagnosis
  diagnosis: {
    primary: { type: String, required: true },
    secondary: { type: String },
    notes: { type: String },
  },

  // Prescription
  prescription: [
    {
      medicationName: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      additionalInstructions: { type: String },
    },
  ],

  // Complaints
  complaints: {
    chiefComplaint: { type: String }, // cc
    knownComplaint: { type: String }, // kc
    additionalComplaint: { type: String }, // ac
  },

  // Assessments - can expand to add specific validations if needed
  assessments: {
    heent: { type: String },
    respiratory: { type: String },
    gastrointestinal: { type: String },
    genitourinary: { type: String },
    musculoskeletal: { type: String },
    cns: { type: String },
  },

  // Investigations
  investigations: [
    {
      reportPicture: { type: String }, // Array of picture URLs or paths
      notes: { type: String },
    },
  ],

  // Instructions
  instructions: {
    notes: { type: String },
  },

  // Follow-up information
  followUp: [
    {
      followUpDate: { type: Date },
      consultationVia: { type: String, enum: ["online", "offline"] },
      plan: { type: String },
    },
  ],

  // Referrals
  referral: [
    {
      specialty: { type: String, required: true },
      doctor: { type: String, required: true },
      hospital: { type: String, required: true },
    },
  ],

  // Additional notes
  notes: { type: String },
});

// Create Visit model
const VisitModel = mongoose.model("Visit", VisitSchema);
module.exports = VisitModel;
