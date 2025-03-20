const express = require("express");
const router = express.Router();
const { newPatientVisit } = require("../controllers/newPatientVisit");

// Create a new visit for a patient
router.post("/:patientId", newPatientVisit);

module.exports = router;
