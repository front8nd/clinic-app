const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { patients } = require("../controllers/patients");

// Patient - Get all patients with optional date filtering and pagination

router.get("/", authMiddleware, patients);

module.exports = router;
