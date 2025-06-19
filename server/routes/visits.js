const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { visits } = require("../controllers/visits");

// Visits - Get all visits with optional date filtering and pagination
router.get("/visits", authMiddleware, visits);

module.exports = router;
