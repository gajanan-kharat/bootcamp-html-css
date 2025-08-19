const Razorpay = require("razorpay");
const { updateData } = require("../config/firebase");
const MailService = require("../services/mail.service");
const { generatePaymentReceiptPDF } = require("../services/pdf.service");

exports.handlePaymentSuccess = (req, res) => {
  const { name, email, mobile, paymentId, orderId } = req.body;

  const amountPaid = process.env.FEE_BOOT_CAMP;
  const transactionDate = new Date().toLocaleString();
  const eventName = process.env.EVENT_NAME;
  const eventDate = process.env.EVENT_DATE;
  const eventLocation = process.env.EVENT_LOCATION;
  const zoomLink = process.env.ZOOM_LINK;

  const updatePaymentData = { paymentId, orderId, paymentStatus: "success" };

  updateData(email, name, mobile, updatePaymentData)
    .then(async () => {
      console.log("✅ Payment Record Updated Successfully in Firebase");

      const extractedFirstName = name.split(" ")[0];
      const firstName = extractedFirstName.charAt(0).toUpperCase() + extractedFirstName.slice(1).toLowerCase();
      const toTitleCase = (str) =>
        str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      const fullname = toTitleCase(name);

      const pdfData = await generatePaymentReceiptPDF({
        name,
        email,
        mobile,
        paymentId,
        orderId,
        amountPaid,
        transactionDate,
        eventName,
        eventDate,
        eventLocation,
        zoomLink,
      });

      // Send Email
      await MailService.sendPaymentEmail({
        firstName,
        fullname,
        email,
        mobile,
        paymentId,
        orderId,
        pdfBuffer: pdfData,
      });

      return res.redirect("/pages/showdata.html");
    })
    .catch((error) => {
      console.error("❌ Error updating document:", error);
      if (!res.headersSent) {
        res.status(500).send(`Error updating document: ${error.message}`);
      }
    });
};

exports.createOrder = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    const order = await instance.orders.create(options);
    res.json({ id: order.id, amount: order.amount, currency: order.currency, key: process.env.KEY_ID });
  } catch (error) {
    res.status(500).send("❌ Error creating Razorpay order");
  }
};
