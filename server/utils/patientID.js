const Counter = require("../models/patientIDSchema");

async function getNextPatientID(session) {
  // Get current date in format DDYY
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0"); // Day with leading zero if needed
  const year = date.getFullYear().toString().slice(-2); // Last two digits of year
  const prefix = `${day}${year}`; // Combine day and year as DDYY

  // Fetch the current counter document
  const counterDoc = await Counter.findOne({ _id: "patientId" }).session(
    session
  );

  // Check if the counter document exists
  if (!counterDoc) {
    // If not, create it and set the counter to 1 and lastResetDate to today
    await Counter.create(
      [
        {
          _id: "patientId",
          patientCounter: 1,
          lastResetDate: date,
        },
      ],
      { session }
    );
  } else {
    // Reset the counter if the date has changed
    const lastResetDate = new Date(counterDoc.lastResetDate);
    if (
      lastResetDate.getDate() !== date.getDate() ||
      lastResetDate.getMonth() !== date.getMonth() ||
      lastResetDate.getFullYear() !== date.getFullYear()
    ) {
      // Reset the counter and update the lastResetDate
      counterDoc.patientCounter = 1; // Reset counter
      counterDoc.lastResetDate = date; // Update to today's date
      await counterDoc.save({ session });
    } else {
      // Increment the counter
      counterDoc.patientCounter += 1;
      await counterDoc.save({ session });
    }
  }

  // Pad the sequence number to 4 digits (e.g., 0001, 0002, ...)
  const sequenceNumber = counterDoc.patientCounter.toString().padStart(4, "0");

  // Combine prefix and sequence number
  return `${prefix}-${sequenceNumber}`;
}

module.exports = getNextPatientID;
