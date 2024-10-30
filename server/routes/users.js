const express = require("express");
const User = require("../models/userSchema");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

// Users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const usersList = await User.find({});
    if (usersList.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    // Exclude the password field from each user document
    const usersListWithoutPassword = usersList.map((user) => {
      const { password, ...userWithoutPassword } = user._doc;
      return userWithoutPassword;
    });

    res.status(200).json(usersListWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
