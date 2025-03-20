const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { appointments } = require("../controllers/appointments");

// Patient - Get all patients with optional date filtering and pagination

router.get("/", authMiddleware, appointments);

module.exports = router;
