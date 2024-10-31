const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    gender,
    password,
    role,
    dob,
    contact,
    address,
    specialization,
    staffRole,
    qualification,
    experience,
  } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Users already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      password: hashedPassword,
      name,
      email,
      gender,
      role,
      dob,
      contact,
      address,
      specialization,
      staffRole,
      qualification,
      experience,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
