// const { uploadData } = require("../config/firebase");

// // POST /sign_up
// exports.handleSignup = (req, res) => {
//   const { name, email, mobile } = req.body;

//   const data = {
//     name,
//     email,
//     mobile,
//     paymentId: "",
//     paymentStatus: "fail",
//   };

//   uploadData(data);
//   console.log("✅ Register Record Inserted Successfully in Firestore");

// return res.redirect(
//   `/pages/signup_successful.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`
// );
// };

// src/controllers/signup.controller.js
import { LeadService } from "../services/lead.service.js";
import { catchAsync } from "../utils/catchAsync.js";
import { config } from "../config/config.js";

export const handleSignup = catchAsync(async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, mobile) are required",
    });
  }

  const docData = {
    name,
    email,
    mobile,
    signupAt: new Date().toISOString(),
    status: "pending",

    // Bootcamp snapshot
    bootcamp: {
      name: config.bootcamp.name,
      date: config.bootcamp.date,
      location: config.bootcamp.location,
      zoomLink: config.bootcamp.zoomLink,
      fee: config.bootcamp.fee,
      currency: config.bootcamp.currency || "INR",
    },

    payment: {
      orderId: "",
      paymentId: "",
      amount: config.bootcamp.fee,
      currency: config.bootcamp.currency || "INR",
      status: "created",
      paidAt: null,
    },

    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  const lead = await LeadService.createLead(docData);

  console.log("✅ Signup record inserted in Firestore:", lead.id);

  res.json({
    success: true,
    message: "Signup successful",
    data: lead,
  });
});

