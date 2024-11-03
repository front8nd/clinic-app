const express = require("express");
const router = express.Router();
const Patient = require("../models/patientSchema");
const PatientMedicalInfo = require("../models/patientMedicalInfoSchema");
const authMiddleware = require("../middleware/auth");

// POST /patients/newPatientMedicalInfo/:patientId - Add medical info for a patient
router.post(
  "/newPatientMedicalInfo/:patientId",
  authMiddleware,
  async (req, res) => {
    const { patientId } = req.params;
    const { fees } = req.body;

    try {
      // Find the patient
      const patient = await Patient.findOne({ patientId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Determine the fee amount based on 'full' or 'custom'
      let feeAmount;
      if (fees.full) {
        const currentDate = new Date();
        const daysSinceCreated =
          (currentDate - new Date(patient.createdAt)) / (1000 * 60 * 60 * 24);
        feeAmount = daysSinceCreated <= 5 ? 500 : 600;
      } else {
        feeAmount = parseInt(fees.custom, 10);
      }

      // Find the last medical info record for the patient to determine the visit number
      const lastVisit = await PatientMedicalInfo.findOne({ patientId }).sort({
        visitNumber: -1,
      });
      const visitNumber = lastVisit ? lastVisit.visitNumber + 1 : 1; // Increment or set to 1

      // Create new medical info record
      const newMedicalInfo = new PatientMedicalInfo({
        patientId,
        visitDate: new Date(),
        visitNumber,
        assistedBy: {
          name: req.body.user.name,
          email: req.body.user.email,
          role: req.body.user.role,
          id: req.body.user.id,
        },
        fees: {
          full: fees.full,
          custom: !fees.full ? feeAmount.toString() : undefined,
        },
        // Include the medical parameters from req.body
        weight: req.body.weight,
        height: req.body.height,
        pulse_rate: req.body.pulse_rate,
        resp_rate: req.body.resp_rate,
        spo2: req.body.spo2,
        temp: req.body.temp,
        rbs: req.body.rbs,
        blood_pressure: {
          sys: req.body.blood_pressure.sys,
          dia: req.body.blood_pressure.dia,
        },
      });

      // Save the new medical info record
      const savedMedicalInfo = await newMedicalInfo.save();

      // Respond with the created medical info record
      res.status(201).json(savedMedicalInfo);
    } catch (error) {
      // Log the error for debugging
      console.error("Error occurred:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
