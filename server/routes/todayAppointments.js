const express = require("express");
const router = express.Router();
const { TodayAppointments } = require("../controllers/todayAppointments");

// API to get today's appointment slots and availability
router.get("/", TodayAppointments);

module.exports = router;
