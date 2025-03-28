// counterSchema.js
const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  patientCounter: { type: Number, required: true },
  lastResetDate: { type: Date, default: Date.now },
});

const CounterModel = mongoose.model("Counter", CounterSchema);

module.exports = CounterModel;
