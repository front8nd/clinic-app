const Config = require("../models/configSchema");

// GET route to fetch config data
exports.getConfig = async (req, res) => {
  try {
    // Use findOne to fetch only the single entry
    const Data = await Config.findOne({});

    if (!Data) {
      return res.status(404).send({ message: "No Data Found" });
    }

    res.status(200).send({
      Data,
      message: "Data fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send({ message: "An internal server error occurred." });
  }
};

// PUT route to update config data
exports.updateConfig = async (req, res) => {
  const { appointmentFees, clinicHours, maxSlots } = req.body;
  try {
    // Fetch the existing configuration data
    let Data = await Config.findOne({});

    if (!Data) {
      // If no data exists, create a new record
      Data = new Config({
        appointmentFees,
        clinicHours,
        maxSlots,
        updatedAt: new Date(),
      });
      await Data.save();
      return res.status(201).send({
        Data,
        message: "Config created successfully.",
      });
    }

    // Update the existing data
    Data.appointmentFees = appointmentFees;
    Data.clinicHours = clinicHours;
    Data.maxSlots = maxSlots;
    Data.updatedAt = new Date();

    // Save the updated document
    await Data.save();

    res.status(200).send({
      Data,
      message: "Config updated successfully.",
    });
  } catch (error) {
    console.error("Error updating data:", error.message);
    res.status(500).send({ message: "An internal server error occurred." });
  }
};
