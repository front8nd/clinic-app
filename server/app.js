const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDB = require("./db/connToDB");
const PORT = process.env.PORT || 5000;

// ENV variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Middleware
app.use(express.json()); // for parsing application/json
app.use(cors());
connectToDB();

// Routes
const register = require("./routes/register");
const login = require("./routes/login");
const users = require("./routes/users");
const patients = require("./routes/patients");
const newPatientProfile = require("./routes/newPatientProfile");
const visits = require("./routes/visits");

// Endpoints
app.use(register);
app.use(login);
app.use(users);
app.use(patients);
app.use(newPatientProfile);
app.use(visits);

// Root route to show a message
app.get("/", (req, res) => {
  res.send(`Server running on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
