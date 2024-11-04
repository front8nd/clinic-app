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
    const { assistedBy, ...medicalParams } = req.body;
    try {
      // Find the patient and check if they exist
      const patient = await Patient.findOne({ patientId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Find the last visit to determine visit number
      const lastVisit = await PatientMedicalInfo.findOne({ patientId }).sort({
        visitNumber: -1,
      });
      const visitNumber = lastVisit ? lastVisit.visitNumber + 1 : 1;

      // Create a new medical info record
      const newMedicalInfo = new PatientMedicalInfo({
        patientId,
        visitDate: new Date(),
        visitNumber,
        assistedBy: {
          name: assistedBy.name,
          email: assistedBy.email,
          role: assistedBy.role,
          id: assistedBy.id,
        },
        ...medicalParams,
      });

      // Save the new medical info record
      const savedMedicalInfo = await newMedicalInfo.save();

      // Respond with the created medical info record
      res.status(201).json(savedMedicalInfo);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
