// const path = require("path");
// const fs = require("fs");
// const nodemailer = require("nodemailer");

// class MailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//   }

//   async sendPaymentEmail({ firstName, fullname, email, mobile, paymentId, orderId, pdfBuffer }) {
//     // Standard template path
//     const emailTemplatePath = path.join(__dirname, "../templates/email/payment-success.html");
//     let emailHTML = fs.readFileSync(emailTemplatePath, "utf8");

//     emailHTML = emailHTML
//       .replace("${firstName}", firstName)
//       .replace("${fullname}", fullname)
//       .replace("${email}", email)
//       .replace("${mobile}", mobile)
//       .replace("${paymentId}", paymentId)
//       .replace("${orderId}", orderId);

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: process.env.EMAIL_SUB,
//       html: emailHTML,
//       attachments: [
//         { filename: "payment_receipt.pdf", content: pdfBuffer },
//       ],
//     };

//     const info = await this.transporter.sendMail(mailOptions);
//     console.log(`📧 Payment email sent to ${email}:`, info.response);
//     return true;
//   }
// }

// src/services/mail.service.js
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import { fileURLToPath } from "url";
import { config } from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendPaymentEmail({
    id,        // ✅ Firestore docId → Receipt ID
    firstName,
    fullname,
    email,
    mobile,
    paymentId,
    orderId,
    pdfBuffer,
  }) {
    try {
      // ---- Load HTML template ----
      const templatePath = path.join(
        __dirname,
        "../templates/email/payment-success.html"
      );
      const templateSource = fs.readFileSync(templatePath, "utf8");

      // ---- Compile HTML with Handlebars ----
      const template = handlebars.compile(templateSource);
      const emailHTML = template({
        firstName,
        fullname,
        email,
        mobile,
        paymentId,
        orderId,
        zoomLink: config.bootcamp.zoomLink,
        whatsappLink: config.bootcamp.whatsappLink,
        eventName: config.bootcamp.name,
        eventDate: config.bootcamp.date,
        eventLocation: config.bootcamp.location,
        amountPaid: `${config.bootcamp.fee / 100} ${config.bootcamp.currency}`,
        receiptId: id,   // ✅ Inject receiptId into template
      });

      // ---- Plain-text fallback version ----
      const plainText = `
Dear ${firstName},

Your payment for ${config.bootcamp.name} has been successfully processed.

Receipt ID : ${id}

Enrollment Details:
- Name      : ${fullname}
- Email     : ${email}
- Mobile    : ${mobile}
- PaymentID : ${paymentId}
- OrderID   : ${orderId}
- Amount    : ${config.bootcamp.fee / 100} ${config.bootcamp.currency}

Event Details:
- Event     : ${config.bootcamp.name}
- Date      : ${config.bootcamp.date}
- Location  : ${config.bootcamp.location}
- Zoom Link : ${config.bootcamp.zoomLink}
👉 Join our WhatsApp Group: ${config.bootcamp.whatsappLink}

Thank you for choosing CodeDisha Technology, Pune.
Best Regards,
CodeDisha Team
      `;

      // ---- Nodemailer options ----
      const mailOptions = {
        from: config.email.user,
        to: email,
        subject: config.email.subject,
        text: plainText,  // plain-text version
        html: emailHTML,  // HTML template
        attachments: [{ filename: "payment_receipt.pdf", content: pdfBuffer }],
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Payment email sent to ${email}:`, info.response);
      return true;
    } catch (err) {
      console.error("❌ Error sending payment email:", err);
      throw err;
    }
  }
}

export default new MailService();

