const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPaymentEmail({ firstName, fullname, email, mobile, paymentId, orderId, pdfBuffer }) {
    // Standard template path
    const emailTemplatePath = path.join(__dirname, "../templates/email/payment-success.html");
    let emailHTML = fs.readFileSync(emailTemplatePath, "utf8");

    emailHTML = emailHTML
      .replace("${firstName}", firstName)
      .replace("${fullname}", fullname)
      .replace("${email}", email)
      .replace("${mobile}", mobile)
      .replace("${paymentId}", paymentId)
      .replace("${orderId}", orderId);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: process.env.EMAIL_SUB,
      html: emailHTML,
      attachments: [
        { filename: "payment_receipt.pdf", content: pdfBuffer },
      ],
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log(`📧 Payment email sent to ${email}:`, info.response);
    return true;
  }
}

module.exports = new MailService();
