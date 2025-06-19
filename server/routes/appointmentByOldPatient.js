const express = require("express");
const router = express.Router();
const {
  appointmentByOldPatient,
} = require("../controllers/appointmentByOldPatient");

router.post("/:patientId", appointmentByOldPatient);

module.exports = router;
