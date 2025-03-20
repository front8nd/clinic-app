const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  patientCompleteProfile,
} = require("../controllers/patientCompleteProfile");

// Get a specific patient profile with all visits and medical info
router.get("/:patientId", authMiddleware, patientCompleteProfile);

module.exports = router;
