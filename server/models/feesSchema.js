const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema(
  {
    // Link to the patient
    patientId: {
      type: String,
      ref: "Patient",
      required: true,
    },
    appointmentNumber: { type: Number, required: true },

    // Fee details
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
    final: {
      type: Number,
      required: true,
      min: 0,
    },

    visitedOn5D: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: true,
    },

    // Audit fields
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const feesModel = mongoose.model("Fees", feesSchema);
module.exports = feesModel;
