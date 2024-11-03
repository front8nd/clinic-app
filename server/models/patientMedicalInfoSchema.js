const mongoose = require("mongoose");

const patientMedicalInfoSchema = new mongoose.Schema({
  patientId: {
    type: String,
    ref: "Patient",
    required: true,
  },

  visitDate: { type: Date, default: Date.now },
  visitNumber: { type: Number, required: true },

  assistedBy: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: String, required: true },
  },

  fees: {
    full: {
      type: Boolean,
      required: true,
    },
    custom: {
      type: String,
    },
  },
  weight: { type: String, required: true },
  height: { type: String },
  pulse_rate: { type: String, required: true },
  resp_rate: { type: String, required: true },
  spo2: { type: String, required: true },
  temp: { type: String, required: true },
  rbs: { type: String, required: true },
  blood_pressure: {
    sys: { type: String, required: true },
    dia: { type: String, required: true },
  },
});

const patientMedicalInfoModel = mongoose.model(
  "PatientMedicalInfo",
  patientMedicalInfoSchema
);

module.exports = patientMedicalInfoModel;
