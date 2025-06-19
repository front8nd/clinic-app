const Visit = require("../models/visitSchema");
const Patient = require("../models/patientSchema");

// Visits - Get all visits with optional date filtering and pagination
exports.visits = async (req, res) => {
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
    const visitList = await Visit.find(filter).skip(skip).limit(limit);
    if (visitList.length === 0) {
      return res.status(404).json({ message: "No Visits found." });
    }

    // Fetch patient data for the visits
    const patientIds = [...new Set(visitList.map((visit) => visit.patientId))]; // Unique patient IDs
    const patients = await Patient.find({ patientId: { $in: patientIds } });

    // Create a mapping of patientId to patient object
    const patientMap = patients.reduce((acc, patient) => {
      acc[patient.patientId] = patient; // Assuming patient._id is the ID
      return acc;
    }, {});

    // Prepare response data
    const visitsWithPatients = visitList.map((visit) => ({
      ...visit._doc, // Use the visit document properties
      patient: patientMap[visit.patientId], // Attach the patient object
    }));

    res.status(200).json({
      message: "Visits retrieved successfully.",
      totalVisits,
      totalPages,
      currentPage: page,
      visits: visitsWithPatients,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
