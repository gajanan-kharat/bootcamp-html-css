const express = require("express");
const router = express.Router();
const {
  handlePaymentSuccess,
  createOrder,
} = require("../controllers/payment.controller");

router.post("/payment_success", handlePaymentSuccess);
router.post("/create-order", createOrder);

module.exports = router;
