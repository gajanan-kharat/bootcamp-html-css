const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

// Load environment variables from backend/.env
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const { initializeFirebaseApp } = require("./config/firebase");

const signupRoutes = require("./routes/signup.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend/public as static assets
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Initialize Firebase Admin SDK
initializeFirebaseApp();

// API Routes
app.use("/api/signup", signupRoutes);
app.use("/api/payment", paymentRoutes);

// Root → serve index.html
app.get("/", (req, res) => {
  return res.redirect("index.html");
});

module.exports = app;
