const path = require("path");
const PDFDocument = require("pdfkit");

function toRowY(n) {
  return 130 + (n - 1) * 20;
}

async function generatePaymentReceiptPDF({
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
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      const logoPath = path.join(
        __dirname,
        "../../../frontend/public/assets/images/codeDisha-img/codeDisha-image.png"
      );
      try {
        doc.image(logoPath, 25, 10, { width: 100, height: 100 });
      } catch (e) {
        console.warn("⚠ Logo not found at path:", logoPath);
      }

      // Title
      doc.moveDown().font("Helvetica-Bold").fontSize(15).text("Payment Receipt", { align: "center" });

      const col1X = 50;
      const col2X = 200;

      const rows = [
        ["Full Name :", name],
        ["Email :", email],
        ["Mobile No :", mobile],
        ["Payment ID :", paymentId],
        ["Amount Paid :", amountPaid],
        ["Transaction Date :", transactionDate],
        ["Event Name :", eventName],
        ["Date :", eventDate],
        ["Location :", eventLocation],
        ["Zoom Link :", zoomLink],
        ["Order ID :", orderId],
      ];

      doc.font("Helvetica").fontSize(12);
      rows.forEach(([label, value], idx) => {
        doc.text(label, col1X, toRowY(idx + 1));
        doc.text(value || "", col2X, toRowY(idx + 1));
      });

      doc.moveDown()
        .text("Thank you for your payment. If you have any questions or concerns, feel free to contact us.", 50, toRowY(11) + 30)
        .moveDown()
        .moveDown()
        .text("Best regards,", { align: "right" })
        .text("CodeDisha Technology, Pune", { align: "right" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePaymentReceiptPDF };
