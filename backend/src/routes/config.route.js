import express from "express";
import { config } from "../config/config.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: {
      fee: config.bootcamp.fee,
      currency: config.bootcamp.currency,
      bootcampName: config.bootcamp.name,
      bootcampDate: config.bootcamp.date,  
      bootcampLocation: config.bootcamp.location,
      zoomLink: config.bootcamp.zoomLink,
      whatsappLink: config.bootcamp.whatsappLink,

      offerName: process.env.OFFER_NAME || null,
      offerEndDate: process.env.OFFER_END_DATE || null,
    },
  });
});

export default router;


