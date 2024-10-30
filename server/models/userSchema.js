const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  contact: { type: String, required: true },
  address: { type: String },
  dob: { type: Date },

  // Role Information
  role: {
    type: String,
    enum: ["admin", "staff", "doctor"],
    required: true,
  },
  specialization: {
    type: String,
    required: function () {
      return this.role === "doctor";
    },
  },
  staffRole: {
    type: String,
    enum: ["receptionist", "nurse"],
    required: function () {
      return this.role === "staff";
    },
  },

  // Professional Details
  qualifications: { type: String },
  experience: { type: Number },

  // Availability
  availability: [{ day: String, hours: String }],

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
