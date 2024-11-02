const express = require("express");
const Patient = require("../models/patientSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Patient - Get all patients with optional date filtering and pagination

router.get("/patients", authMiddleware, async (req, res) => {
  const { date } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    // Build filter for date if provided
    const filter = {};
    if (date) {
      const selectedDate = new Date(date);
      filter.createdAt = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)), // End of the day
      };
    }

    // Calculate total count for pagination
    const totalPatients = await Patient.countDocuments(filter);
    const totalPages = limit ? Math.ceil(totalPatients / limit) : 1;
    const skip = (page - 1) * limit;

    // Retrieve patients with filtering and pagination
    const patientList = await Patient.find(filter).skip(skip).limit(limit);

    if (patientList.length === 0) {
      return res.status(404).json({ message: "No Patients found." });
    }

    res.status(200).json({
      message: "Patients retrieved successfully.",
      totalPatients,
      totalPages,
      currentPage: page,
      patients: patientList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
