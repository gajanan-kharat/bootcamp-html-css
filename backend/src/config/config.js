// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "../../.env") });

// export const config = {
//   port: process.env.PORT || 3000,

//   firebase: {
//     collection: process.env.DB_COLLECTION_NAME || "bootcamp",
//   },

//   razorpay: {
//     keyId: process.env.KEY_ID,
//     keySecret: process.env.KEY_SECRET,
//   },

//   email: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//     subject: process.env.EMAIL_SUB || "Payment Successful",
//   },

//   bootcamp: {
//     fee: process.env.FEE_BOOT_CAMP,
//     name: process.env.EVENT_NAME,
//     date: process.env.EVENT_DATE,
//     location: process.env.EVENT_LOCATION,
//     zoomLink: process.env.ZOOM_LINK,
//   },
// };


import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  port: process.env.PORT || 3000,

  firebase: {
    collection: process.env.DB_COLLECTION_NAME || "bootcamp",
  },

  razorpay: {
    keyId: process.env.KEY_ID,
    keySecret: process.env.KEY_SECRET,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    subject: process.env.EMAIL_SUB || "Payment Successful",
  },

  bootcamp: {
    fee: parseInt(process.env.FEE_BOOT_CAMP, 10), // in paise
    name: process.env.EVENT_NAME,
    date: process.env.EVENT_DATE,
    location: process.env.EVENT_LOCATION,
    zoomLink: process.env.ZOOM_LINK,
      whatsappLink: process.env.WHATSAPP_LINK,
  currency: "INR",
  },
};
