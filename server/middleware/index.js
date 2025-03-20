const cors = require("cors");
const express = require("express");

module.exports = (app) => {
  app.use(express.json()); // Parse JSON requests
  app.use(cors()); // Enable CORS for all requests
};
