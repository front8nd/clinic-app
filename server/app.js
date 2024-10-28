// app.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // for parsing application/json

// Routes
const userRoutes = require("./routes/users");

// Endpoints
app.use("/users", userRoutes);

// Root route to show a message
app.get("/", (req, res) => {
  res.send(`Server running on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
