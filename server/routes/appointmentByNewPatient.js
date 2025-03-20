const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const {
  appointmentByNewPatient,
} = require("../controllers/appointmentByNewPatient");

router.post("/", authMiddleware, appointmentByNewPatient);

module.exports = router;
