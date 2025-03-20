const express = require("express");
const router = express.Router();

// Import Routes
const register = require("./register");
const login = require("./login");
const users = require("./users");
const patients = require("./patients");
const visits = require("./visits");
const patientCompleteProfile = require("./patientCompleteProfile");
const newPatientProfile = require("./newPatientProfile");
const newPatientMedicalInfo = require("./newPatientMedicalInfo");
const newPatientVisit = require("./newPatientVisit");
const todayAppointments = require("./todayAppointments");
const appointments = require("./appointments");
const appointmentByOldPatient = require("./appointmentByOldPatient");
const appointmentByNewPatient = require("./appointmentByNewPatient");
const config = require("./config");

// Attach routes
router.use("/register", register);
router.use("/login", login);
router.use("/users", users);
router.use("/patients", patients);
router.use("/visits", visits);
router.use("/patientCompleteProfile", patientCompleteProfile);
router.use("/newPatientProfile", newPatientProfile);
router.use("/newPatientMedicalInfo", newPatientMedicalInfo);
router.use("/newPatientVisit", newPatientVisit);
router.use("/today-appointments", todayAppointments);
router.use("/appointments", appointments);
router.use("/appointmentByOldPatient", appointmentByOldPatient);
router.use("/appointmentByNewPatient", appointmentByNewPatient);
router.use("/config", config);

module.exports = router;
