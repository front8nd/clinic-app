const Patient = require("../models/patientSchema");
const Visit = require("../models/visitSchema");
const Appointment = require("../models/appointmentSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const Fees = require("../models/feesSchema");

// Get a specific patient profile with all visits and medical info
exports.patientCompleteProfile = async (req, res) => {
  const { patientId } = req.params;
  try {
    // Find the patient by patientId as a String
    const patient = await Patient.findOne({ patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    // Retrieve all appointments associated with the patient using the unique patientId
    const appointments = await Appointment.find({ patientId }).sort({
      appointmentNumber: -1,
    });

    // Retrieve all visits associated with the patient using the unique patientId
    const visits = await Visit.find({ patientId }).sort({
      appointmentNumber: -1,
    });

    // Retrieve all medical information associated with the patient
    const medicalInfo = await PatientMedicalInfo.find({ patientId }).sort({
      appointmentNumber: -1,
    });

    // Retrieve all fees information associated with the patient
    const feesInfo = await Fees.find({ patientId }).sort({
      appointmentNumber: -1,
    });

    // Return the patient profile, visits, and medical info
    res.status(200).json({
      patient,
      visits,
      medicalInfo,
      appointments,
      feesInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
