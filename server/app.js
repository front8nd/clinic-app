const express = require("express");
const dotenv = require("dotenv");
const connectToDB = require("./db/connToDB");
const applyMiddleware = require("./middleware/index");
const routes = require("./routes/index");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 5000;
const app = express();

// Apply middleware
applyMiddleware(app);

// Use routes
app.use(routes);

// Root route
app.get("/", (req, res) => {
  res.send(`🚀 Server running on http://localhost:${PORT}`);
});

// Start the server
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  // Connect to DB (will retry if failed)
  await connectToDB();
});
