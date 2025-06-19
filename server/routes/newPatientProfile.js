const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { newPatientProfile } = require("../controllers/newPatientProfile");

// POST /patients/newPatientProfile - Create a new patient profile and book an appointment
router.post("/", authMiddleware, newPatientProfile);

module.exports = router;
