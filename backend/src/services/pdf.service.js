// const path = require("path");
// const PDFDocument = require("pdfkit");

// function toRowY(n) {
//   return 130 + (n - 1) * 20;
// }

// async function generatePaymentReceiptPDF({
//   name,
//   email,
//   mobile,
//   paymentId,
//   orderId,
//   amountPaid,
//   transactionDate,
//   eventName,
//   eventDate,
//   eventLocation,
//   zoomLink,
// }) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument();
//       const buffers = [];
//       doc.on("data", buffers.push.bind(buffers));
//       doc.on("end", () => resolve(Buffer.concat(buffers)));

//       const logoPath = path.join(
//         __dirname,
//         "../../../frontend/public/assets/images/codeDisha-img/codeDisha-image.png"
//       );
//       try {
//         doc.image(logoPath, 25, 10, { width: 100, height: 100 });
//       } catch (e) {
//         console.warn("⚠ Logo not found at path:", logoPath);
//       }

//       // Title
//       doc.moveDown().font("Helvetica-Bold").fontSize(15).text("Payment Receipt", { align: "center" });

//       const col1X = 50;
//       const col2X = 200;

//       const rows = [
//         ["Full Name :", name],
//         ["Email :", email],
//         ["Mobile No :", mobile],
//         ["Payment ID :", paymentId],
//         ["Amount Paid :", amountPaid],
//         ["Transaction Date :", transactionDate],
//         ["Event Name :", eventName],
//         ["Date :", eventDate],
//         ["Location :", eventLocation],
//         ["Zoom Link :", zoomLink],
//         ["Order ID :", orderId],
//       ];

//       doc.font("Helvetica").fontSize(12);
//       rows.forEach(([label, value], idx) => {
//         doc.text(label, col1X, toRowY(idx + 1));
//         doc.text(value || "", col2X, toRowY(idx + 1));
//       });

//       doc.moveDown()
//         .text("Thank you for your payment. If you have any questions or concerns, feel free to contact us.", 50, toRowY(11) + 30)
//         .moveDown()
//         .moveDown()
//         .text("Best regards,", { align: "right" })
//         .text("CodeDisha Technology, Pune", { align: "right" });

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// module.exports = { generatePaymentReceiptPDF };

// src/services/pdf.service.js
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROW_HEIGHT = 28;
const START_Y = 170;

export async function generatePaymentReceiptPDF({
  id,
  name,
  email,
  mobile,
  paymentId,
  orderId,
  amountPaid,
  transactionDate,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const logoPath = path.join(
        __dirname,
        "../../../frontend/public/assets/images/codeDisha-img/codeDisha-image.png"
      );

      // ✅ Watermark (centered faint logo)
      try {
        doc.opacity(0.08).image(logoPath, doc.page.width / 4, doc.page.height / 3, {
          width: 300,
          align: "center",
        });
        doc.opacity(1);
      } catch (e) {
        console.warn("⚠ Watermark logo not found at path:", logoPath);
      }

      // ✅ Header logo (top-left)
      try {
        doc.image(logoPath, 50, 30, { width: 80 });
      } catch (e) {
        console.warn("⚠ Logo not found at path:", logoPath);
      }

      // ✅ Title
      doc.font("Helvetica-Bold")
        .fontSize(20)
        .text("Payment Receipt", { align: "center", underline: true })
        .moveDown(2);

      // ✅ Data rows
      const rows = [
        ["Receipt ID", id],
        ["Full Name", name],
        ["Email", email],
        ["Mobile No", mobile],
        ["Payment ID", paymentId],
        ["Order ID", orderId],
        ["Amount Paid", `${amountPaid / 100} INR`],
        ["Transaction Date", transactionDate],
        ["Event Name", config.bootcamp.name],
        ["Date", config.bootcamp.date],
        ["Location", config.bootcamp.location],
        ["Zoom Link", config.bootcamp.zoomLink],
        ["WhatsApp Group", config.bootcamp.whatsappLink],
      ];

      const col1X = 50;
      const col2X = 220;
      let y = START_Y;

      doc.font("Helvetica").fontSize(12);

      rows.forEach(([label, value]) => {
        // Light border around each row
        doc.rect(col1X - 5, y - 5, 500, ROW_HEIGHT)
          .strokeColor("#ddd")
          .lineWidth(0.5)
          .stroke();

        // Label + Value
        doc.fillColor("black").text(`${label}:`, col1X, y, { width: 160 });
        doc.text(value || "N/A", col2X, y, { width: 300 });

        y += ROW_HEIGHT;
      });

      // ✅ Friendly footer message
      doc.moveDown(3)
        .font("Helvetica-Oblique")
        .fontSize(11)
        .fillColor("black")
        .text(
          "Thank you for your payment. If you have any questions or concerns, feel free to contact us.",
          { align: "left" }
        );

      // ✅ Issued On (bottom-left)
      const issuedOn = new Date().toLocaleString();
      const footerY = doc.page.height - 100;

      doc.font("Helvetica")
        .fontSize(11)
        .text(`Issued On: ${issuedOn}`, 50, footerY);

      // ✅ Signature line + label (bottom-right)
      doc.moveTo(350, footerY - 10)
        .lineTo(550, footerY - 10)
        .strokeColor("black")
        .lineWidth(1)
        .stroke();

      doc.font("Helvetica-Bold")
        .fontSize(12)
        .text("Director", 350, footerY, { align: "right", width: 200 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}



