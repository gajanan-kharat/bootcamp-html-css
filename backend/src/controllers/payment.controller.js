// const Razorpay = require("razorpay");
// const { updateData } = require("../config/firebase");
// const MailService = require("../services/mail.service");
// const { generatePaymentReceiptPDF } = require("../services/pdf.service");

// exports.handlePaymentSuccess = (req, res) => {
//   const { name, email, mobile, paymentId, orderId } = req.body;

//   const amountPaid = process.env.FEE_BOOT_CAMP;
//   const transactionDate = new Date().toLocaleString();
//   const eventName = process.env.EVENT_NAME;
//   const eventDate = process.env.EVENT_DATE;
//   const eventLocation = process.env.EVENT_LOCATION;
//   const zoomLink = process.env.ZOOM_LINK;

//   const updatePaymentData = { paymentId, orderId, paymentStatus: "success" };

//   updateData(email, name, mobile, updatePaymentData)
//     .then(async () => {
//       console.log("✅ Payment Record Updated Successfully in Firebase");

//       const extractedFirstName = name.split(" ")[0];
//       const firstName = extractedFirstName.charAt(0).toUpperCase() + extractedFirstName.slice(1).toLowerCase();
//       const toTitleCase = (str) =>
//         str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
//       const fullname = toTitleCase(name);

//       const pdfData = await generatePaymentReceiptPDF({
//         name,
//         email,
//         mobile,
//         paymentId,
//         orderId,
//         amountPaid,
//         transactionDate,
//         eventName,
//         eventDate,
//         eventLocation,
//         zoomLink,
//       });

//       // Send Email
//       await MailService.sendPaymentEmail({
//         firstName,
//         fullname,
//         email,
//         mobile,
//         paymentId,
//         orderId,
//         pdfBuffer: pdfData,
//       });

//       return res.redirect("/pages/showdata.html");
//     })
//     .catch((error) => {
//       console.error("❌ Error updating document:", error);
//       if (!res.headersSent) {
//         res.status(500).send(`Error updating document: ${error.message}`);
//       }
//     });
// };

// exports.createOrder = async (req, res) => {
//   const instance = new Razorpay({
//     key_id: process.env.KEY_ID,
//     key_secret: process.env.KEY_SECRET,
//   });

//   const options = {
//     amount: req.body.amount,
//     currency: req.body.currency,
//   };

//   try {
//     const order = await instance.orders.create(options);
//     res.json({ id: order.id, amount: order.amount, currency: order.currency, key: process.env.KEY_ID });
//   } catch (error) {
//     res.status(500).send("❌ Error creating Razorpay order");
//   }
// };


// src/controllers/payment.controller.js
import Razorpay from "razorpay";
import { LeadService } from "../services/lead.service.js";
import MailService from "../services/mail.service.js";
import { generatePaymentReceiptPDF } from "../services/pdf.service.js";
import { config } from "../config/config.js";
import { catchAsync } from "../utils/catchAsync.js";

//
// ⚡ Handle payment success (ID-based)
//
export const handlePaymentSuccess = async (req, res) => {
  const { id, paymentId, orderId } = req.body;

  try {
        if (!id) {
      return res.status(400).json({ success: false, message: "docId (id) is required" });
    }
    // ---- Update Firestore by docId ----
    const updatedId = await LeadService.updatePaymentById(id, {
      status: "paid",
      payment: {
        orderId,
        paymentId,
        status: "success",
        paidAt: new Date().toISOString(),
      },
      meta: { updatedAt: new Date().toISOString() },
    });

    if (!updatedId) {
      return res.status(404).json({ success: false, message: "No signup found for this ID" });
    }

    console.log("✅ Payment Record Updated Successfully, Firestore ID:", updatedId);

    // ---- Fetch lead details for email + PDF ----
    const lead = await LeadService.getLeadById(updatedId);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found after update" });
    }

    const { name, email, mobile } = lead;

    const fullname = name
      ? name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
      : "";
    const firstName = fullname.split(" ")[0] || "";

    // ---- Generate PDF Receipt ----
    const pdfData = await generatePaymentReceiptPDF({
            id: updatedId,
      name,
      email,
      mobile,
      paymentId,
      orderId,
      amountPaid: config.bootcamp.fee,
      transactionDate: new Date().toLocaleString(),
      eventName: config.bootcamp.name,
      eventDate: config.bootcamp.date,
      eventLocation: config.bootcamp.location,
      zoomLink: config.bootcamp.zoomLink,
    });

    // ---- Send Email with PDF ----
    await MailService.sendPaymentEmail({
      firstName,
      fullname,
      email,
      mobile,
      paymentId,
      orderId,
      pdfBuffer: pdfData,
      zoomLink: config.bootcamp.zoomLink,
            id: updatedId 
    });

    // ✅ Redirect to showdata.html with ID param
    return res.redirect(`/pages/showdata.html?id=${updatedId}`);

  } catch (error) {
    console.error("❌ Error in handlePaymentSuccess:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: `Error processing payment: ${error.message}` });
    }
  }
};

//
// ⚡ Create Razorpay order
//
export const createOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
    };

    const order = await instance.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: config.razorpay.keyId,
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay order", error);
    res.status(500).json({ success: false, message: "Error creating Razorpay order" });
  }
};

//
// ⚡ Return student bootcamp+payment info by docId
//
export const getReceipt = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  const lead = await LeadService.getLeadById(id);
  if (!lead) {
    return res.status(404).json({ success: false, message: "No record found" });
  }

  res.json({
    success: true,
    data: {
      ...lead,
      bootcamp: {
        ...config.bootcamp, // ensures event info always comes from SSOT
      },
    },
  });
});

