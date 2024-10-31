const express = require("express");
const Visit = require("../models/visitSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Visits - Get all visits with optional date filtering and pagination
router.get("/visits", authMiddleware, async (req, res) => {
  const { date, page = 1, limit = 10 } = req.query; // Default to page 1 and limit to 10

  try {
    // Build filter for date if provided
    const filter = {};
    if (date) {
      const selectedDate = new Date(date);
      // Set the filter to find visits created on the specified date
      filter.date = {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)), // Start of the day
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999)), // End of the day
      };
    }

    // Calculate total count for pagination
    const totalVisits = await Visit.countDocuments(filter);
    const totalPages = Math.ceil(totalVisits / limit);
    const skip = (page - 1) * limit;

    // Retrieve visits with filtering and pagination
    const visitList = await Visit.find(filter)
      .populate("patientId", "name") // Optionally populate patient name
      .populate("doctorId", "name") // Optionally populate doctor name
      .skip(skip)
      .limit(Number(limit)); // Convert limit to number

    if (visitList.length === 0) {
      return res.status(404).json({ message: "No Visits found." });
    }

    res.status(200).json({
      totalVisits,
      totalPages,
      currentPage: Number(page),
      visits: visitList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
