
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
    id,
    firstName,
    fullname,
    email,
    mobile,
    paymentId,
    orderId,
    pdfBuffer,
  }) {
    try {
      const templatePath = path.join(
        __dirname,
        "../templates/email/payment-success.html"
      );
      const templateSource = fs.readFileSync(templatePath, "utf8");

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
        receiptId: id,
      });

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

      const mailOptions = {
        from: config.email.user,
        to: email,
        subject: config.email.subject,
        text: plainText,
        html: emailHTML,
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

