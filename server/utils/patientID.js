const Counter = require("../models/patientIDSchema");

async function getNextPatientID() {
  // Get current date in format DDYY
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0"); // Day with leading zero if needed
  const year = date.getFullYear().toString().slice(-2); // Last two digits of year
  const prefix = `${day}${year}`; // Combine day and year as DDYY

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
