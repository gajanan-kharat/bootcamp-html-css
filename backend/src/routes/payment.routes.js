
// import { Router } from "express";
// import { handlePaymentSuccess, createOrder } from "../controllers/payment.controller.js";

// const router = Router();

// router.post("/payment_success", handlePaymentSuccess);

// router.post("/create-order", createOrder);

// export default router;


// src/routes/payment.routes.js
import { Router } from "express";
import { handlePaymentSuccess, createOrder, getReceipt } from "../controllers/payment.controller.js";

const router = Router();

// Create Razorpay order
router.post("/create-order", createOrder);

// Payment success callback
router.post("/success", handlePaymentSuccess);

router.get("/receipt/:id", getReceipt);

export default router;
