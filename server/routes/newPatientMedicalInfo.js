const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  newPatientMedicalInfo,
} = require("../controllers/newPatientMedicalInfo");

router.post("/:patientId", authMiddleware, newPatientMedicalInfo);

module.exports = router;
