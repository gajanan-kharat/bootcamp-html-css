import { Router } from "express";
import {
    handlePaymentSuccess,
    handlePaymentFailure,
    createOrder,
    getReceipt
} from "../controllers/payment.controller.js";

const router = Router();
router.post("/create-order", createOrder);

router.post("/success", handlePaymentSuccess);

router.post("/failure", handlePaymentFailure);

router.get("/receipt/:id", getReceipt);

export default router;
