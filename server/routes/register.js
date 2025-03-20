const express = require("express");
const router = express.Router();
const { register } = require("../controllers/register");

// Register
router.post("/", register);

module.exports = router;
