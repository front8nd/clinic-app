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
  visitNumber: { type: Number },
  visitType: { type: String, enum: ["initial", "follow-up", "emergency"] },
  date: { type: Date, default: Date.now },
  diagnosis: {
    primary: { type: String },
    secondary: { type: String },
    notes: { type: String },
  },
  prescription: [
    {
      medicationName: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true },
      additionalInstructions: { type: String },
    },
  ],
  complaints: {
    cc: [{ type: String }],
    kc: [{ type: String }],
    ac: [{ type: String }],
  },
  assessments: {
    heenth: [{ type: String }],
    resp: [{ type: String }],
    gi: [{ type: String }],
    gu: [{ type: String }],
    mskl: [{ type: String }],
    cns: [{ type: String }],
  },
  investigations: [
    {
      reportPicture: [{ type: String }],
      notes: [{ type: String }], // mulitiple
    },
  ],
  instructions: {
    notes: [{ type: String }], // mulitiple
  },
  followUp: [
    {
      followUpDate: { type: Date },
      consulationVia: { type: String, enum: ["online", "offline"] },
      plan: { type: String },
    },
  ],
  rafrel: [
    {
      speciality: { type: String, required: true },
      doctor: { type: String, required: true },
      hospital: { type: String, required: true },
    },
  ],
  notes: { type: String },
});

const VisitModel = mongoose.model("Visit", VisitSchema);
module.exports = { VisitModel };
