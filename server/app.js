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
const users = require("./routes/users"); // all users
const patients = require("./routes/patients"); // all patients
const visits = require("./routes/visits"); // all visits
const patientCompleteProfile = require("./routes/patientCompleteProfile"); // get patient profile, medical info and visits
const newPatientProfile = require("./routes/newPatientProfile"); // a new profile will be created 1st time
const newPatientMedicalInfo = require("./routes/newPatientMedicalInfo"); // 2nd time only medical info will be added by STAFF
const newPatientVisit = require("./routes/newPatientVisit"); // visit data will be filled by Doctor everytime, needs patient profile to be created first and retrived via patientCompleteProfile

// Endpoints
app.use(register);
app.use(login);
app.use(users);
app.use(patients);
app.use(visits);
app.use(patientCompleteProfile);
app.use(newPatientProfile);
app.use(newPatientMedicalInfo);
app.use(newPatientVisit);

// Root route to show a message
app.get("/", (req, res) => {
  res.send(`Server running on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
