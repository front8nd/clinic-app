const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectToDB = async () => {
  if (isConnected) {
    console.log("🔄 Using existing database connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Initial DB connection failed:", error.message);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  console.log("📡 MongoDB reconnected");
  isConnected = true;
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected. Retrying...");
  isConnected = false;
  setTimeout(connectToDB, 5000); // Retry after 5 seconds
});

mongoose.connection.on("error", (err) => {
  console.error("🚨 MongoDB connection error:", err);
  isConnected = false;
});

module.exports = connectToDB;
