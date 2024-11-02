const express = require("express");
const Visit = require("../models/visitSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Visits - Get all visits with optional date filtering and pagination

router.get("/visits", authMiddleware, async (req, res) => {
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
    const totalVisits = await Visit.countDocuments(filter);
    const totalPages = limit ? Math.ceil(totalVisits / limit) : 1;
    const skip = (page - 1) * limit;

    // Retrieve visits with filtering and pagination
    const visitList = await Visit.find(filter)
      .populate("patientId", "name") // Optionally populate patient name
      .populate("doctorId", "name") // Optionally populate doctor name
      .skip(skip)
      .limit(limit);

    if (visitList.length === 0) {
      return res.status(404).json({ message: "No Visits found." });
    }

    res.status(200).json({
      message: "Visits retrieved successfully.",
      totalVisits,
      totalPages,
      currentPage: page,
      visits: visitList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
