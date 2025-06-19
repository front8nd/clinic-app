const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const ConfigController = require("../controllers/config");

// GET route to fetch config data
router.get("/", authMiddleware, ConfigController.getConfig);

// PUT route to update config data
router.get("/", authMiddleware, ConfigController.updateConfig);

module.exports = router;
