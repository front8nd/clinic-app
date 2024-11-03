const Counter = require("../models/patientIDSchema");

async function getNextPatientID() {
  // Get current date in format YYMM
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const prefix = `${month}${year}`;

  // Find and increment the sequence value atomically
  const counter = await Counter.findOneAndUpdate(
    { _id: "patientId" },
    { $inc: { patientCounter: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  // Pad the sequence number to 4 digits (e.g., 0001, 0002, ...)
  const sequenceNumber = counter.patientCounter.toString().padStart(4, "0");

  // Combine prefix and sequence number
  return `${prefix}-${sequenceNumber}`;
}

module.exports = getNextPatientID;
