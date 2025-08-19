const express = require("express");
const router = express.Router();
const { handleSignup } = require("../controllers/signup.controller");

router.post("/sign_up", handleSignup);

module.exports = router;
