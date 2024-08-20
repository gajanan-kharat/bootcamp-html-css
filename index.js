var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const app = express();
const {
  initializeFirebaseApp,
  uploadData,
  updateData,
} = require("./firebase");

require("dotenv").config();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

initializeFirebaseApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/sign_up", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;

  var data = {
    name: name,
    email: email,
    mobile: mobile,
    paymentId: "",
    paymentStatus: "fail",
  };

  uploadData(data);
  console.log("Register Record Inserted Successfully in Firestore");

  return res.redirect(
    `/signup_successful.html?name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}`
  );
});

app.post("/payment_success", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var paymentId = req.body.paymentId;

  var amountPaid = process.env.FEE_BOOT_CAMP;
  var transactionDate = new Date().toLocaleString();

  
  var eventName = process.env.EVENT_NAME;
  var eventDate = process.env.EVENT_DATE;
  var eventLocation = process.env.EVENT_LOCATION;
  var zoomLink = process.env.ZOOM_LINK;

  const updatePaymentData = {
    paymentId: paymentId,
    paymentStatus: "success",
  };

  updateData(email, name, mobile, updatePaymentData)
    .then(() => {
      console.log(
        "Payment Record Updated to pass in firebase.js file Successfully"
      );

      // Create a new PDF document
      const doc = new PDFDocument();

      // Pipe the PDF document to a buffer
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);

        // Send email
        const mailOptions = {
          // Add this one in env file. from and subject 
          from: "sushamajun95@gmail.com",
          to: email,
          subject: "Payment Successful",
          html: process.env.EMAIL_TEMPLATE,
          attachments: [
            {
              filename: "payment_receipt.pdf",
              content: pdfData,
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      });

      // Add content to the PDF document
      doc.image("codemind-img/codemind-img.jpeg", 25, 10, {
        width: 100,
        height: 100,
      });
      doc.moveDown();
      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("Payment Receipt", { align: "center" });

      // Calculate the position for each row
      const row1Y = 130;
      const row2Y = row1Y + 20;
      const row3Y = row2Y + 20;
      const row4Y = row3Y + 20;
      const row5Y = row4Y + 20;
      const row6Y = row5Y + 20;
      const row7Y = row6Y + 20;
      const row8Y = row7Y + 20;
      const row9Y = row8Y + 20;
      const row10Y = row9Y + 20;

      // Define the column positions
      const col1X = 50;
      const col2X = 200;

      doc.font("Helvetica").fontSize(12);
      doc.text(" Full Name : ", col1X, row1Y);
      doc.text(name, col2X, row1Y);

      doc.text(" Email : ", col1X, row2Y);
      doc.text(email, col2X, row2Y);

      doc.text(" Mobile No : ", col1X, row3Y);
      doc.text(mobile, col2X, row3Y);

      doc.text(" Payment ID : ", col1X, row4Y);
      doc.text(paymentId, col2X, row4Y);

      doc.text(" Amount Paid : ", col1X, row5Y);
      doc.text(amountPaid, col2X, row5Y);

      doc.text(" Transaction Date : ", col1X, row6Y);
      doc.text(transactionDate, col2X, row6Y);

      doc.text(" Event Name  : ", col1X, row7Y);
      doc.text(eventName, col2X, row7Y);

      doc.text(" Date : ", col1X, row8Y);
      doc.text(eventDate, col2X, row8Y);

      doc.text(" Location : ", col1X, row9Y);
      doc.text(eventLocation, col2X, row9Y);

      doc.text(" Zoom Link : ", col1X, row10Y);
      doc.text(zoomLink, col2X, row10Y);

      doc.moveDown();
      doc.text(
        "Thank you for your payment. If you have any questions or concerns, feel free to contact us.",
        50,
        row10Y + 30
      );
      doc.moveDown();
      doc.moveDown();
      doc.text("Best regards,", { align: "right" });
      doc.text("Codemind Technology, Pune", { align: "right" });
      doc.end();

      return res.redirect("/showdata.html");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      // Send error response only if no response has been sent
      if (!res.headersSent) {
        res.status(500).send("Error updating document: " + error.message);
      }
    });
});

const PORT = process.env.PORT || 3000;
app
  .get("/", (req, res) => {
    res.set({
      "Allow-Access-Allow-Origin": "*",
    });
    return res.redirect("index.html");
  })
  .listen(PORT);

console.log("Listening on port 3000");
