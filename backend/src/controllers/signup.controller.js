
import { LeadService } from "../services/lead.service.js";
import { catchAsync } from "../utils/catchAsync.js";

export const handleSignup = catchAsync(async (req, res) => {
  const { name, email, mobile, bootcampId = "default" } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, mobile) are required",
    });
  }

  const existing = await LeadService.getLeadByEmail(email);
  if (existing && existing.bootcampId === bootcampId) {
    console.log("⚠️ Student already signed up for this bootcamp, returning existing doc:", existing.id);
    return res.json({ success: true, message: "Already registered", data: existing });
  }

  const docData = {
    student: { name, email, mobile },
    bootcampId,
    status: "created",
    payment: {
      orderId: "",
      paymentId: "",
      amount: 0,
      currency: "INR",
      status: "created",
      paidAt: null,
    },
    paymentAttempts: [],
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
