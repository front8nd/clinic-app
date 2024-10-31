const mongoose = require("mongoose");

let isConnected = false; // track connection status

const connectToDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

module.exports = connectToDB;
