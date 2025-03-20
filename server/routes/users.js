const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { users } = require("../controllers/users");

// Users
router.get("/", authMiddleware, users);

module.exports = router;
