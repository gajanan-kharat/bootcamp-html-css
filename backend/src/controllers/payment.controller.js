import Razorpay from "razorpay";
import { LeadService } from "../services/lead.service.js";
import MailService from "../services/mail.service.js";
import { generatePaymentReceiptPDF } from "../services/pdf.service.js";
import { config } from "../config/config.js";
import { catchAsync } from "../utils/catchAsync.js";

async function retryAsync(fn, retries = 3, delay = 2000) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.error(`❌ Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

export const handlePaymentSuccess = async (req, res) => {
  const { id, paymentId, orderId } = req.body;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "docId (id) is required" });
    }

    const lead = await LeadService.getLeadById(id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    if (lead.status === "paid") {
      console.log(
        "⚠️ Lead already marked as paid, ignoring duplicate success:",
        id
      );
      return res.redirect(`/pages/showdata.html?id=${id}`);
    }

    const attempts = lead.paymentAttempts || [];
    attempts.push({
      orderId,
      paymentId,
      status: "success",
      message: "Payment captured successfully",
      date: new Date().toISOString(),
    });

    await LeadService.updatePaymentById(id, {
      status: "paid",
      payment: {
        orderId,
        paymentId,
        amount: config.bootcamp.fee,
        currency: config.bootcamp.currency || "INR",
        status: "success",
        paidAt: new Date().toISOString(),
      },
      paymentAttempts: attempts,
      meta: { updatedAt: new Date().toISOString() },
    });

    console.log("✅ Payment updated Successfully, Firestore ID:", id);

    res.redirect(`/pages/showdata.html?id=${id}`);

    setImmediate(async () => {
      try {
        const fullname = lead.student.name
          ? lead.student.name
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ")
          : "";
        const firstName = fullname.split(" ")[0] || "";

        const pdfData = await retryAsync(
          () =>
            generatePaymentReceiptPDF({
              id,
              name: lead.student.name,
              email: lead.student.email,
              mobile: lead.student.mobile,
              paymentId,
              orderId,
              amountPaid: config.bootcamp.fee,
              transactionDate: new Date().toLocaleString(),
            }),
          3,
          2000
        );

        await retryAsync(
          () =>
            MailService.sendPaymentEmail({
              id,
              firstName,
              fullname,
              email: lead.student.email,
              mobile: lead.student.mobile,
              paymentId,
              orderId,
              pdfBuffer: pdfData,
            }),
          3,
          3000
        );

        console.log(
          `📧 Payment email sent successfully to ${lead.student.email}`
        );
      } catch (bgErr) {
        console.error("❌ Background PDF/Email job failed completely:", bgErr);
      }
    });
  } catch (error) {
    console.error("❌ Error in handlePaymentSuccess:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          success: false,
          message: `Error processing payment: ${error.message}`,
        });
    }
  }
};

export const handlePaymentFailure = async (req, res) => {
  const { id, orderId, errorReason } = req.body;
  try {
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "docId (id) is required" });

    const lead = await LeadService.getLeadById(id);
    if (!lead)
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });

    if (lead.status === "paid") {
      console.log("⚠️ Ignored failure for already paid lead:", id);
      return res.redirect(`/pages/showdata.html?id=${id}`);
    }

    const attempts = lead.paymentAttempts || [];
    attempts.push({
      orderId,
      status: "failed",
      message: errorReason || "cancelled/technical error",
      date: new Date().toISOString(),
    });

    await LeadService.updatePaymentById(id, {
      status: "failed",
      payment: {
        orderId,
        status: "failed",
        failureReason: errorReason || "cancelled/technical error",
        paidAt: null,
      },
      paymentAttempts: attempts,
      meta: { updatedAt: new Date().toISOString() },
    });

    console.log("⚠️ Payment Failed for student docId:", id);
    return res.redirect(`/pages/payment_failed.html?id=${id}`);
  } catch (err) {
    console.error("❌ Error in handlePaymentFailure:", err);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          success: false,
          message: `Error handling failed payment: ${err.message}`,
        });
    }
  }
};

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
    res
      .status(500)
      .json({ success: false, message: "Error creating Razorpay order" });
  }
};

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
      bootcamp: { ...config.bootcamp },
    },
  });
});
