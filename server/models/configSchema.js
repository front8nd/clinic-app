const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
  clinicHours: {
    morning: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
    evening: {
      start: { type: Number, required: true },
      end: { type: Number, required: true },
    },
  },
  maxSlots: {
    type: Number,
    required: true,
  },

  appointmentFees: {
    type: Number,
    required: true,
  },

  fifthDayDiscount: {
    type: Number,
    required: true,
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const configModel = mongoose.model("Config", configSchema);
module.exports = configModel;
