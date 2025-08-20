
// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// import { fileURLToPath } from "url";
// import helmet from "helmet";
// import morgan from "morgan";
// import cors from "cors";

// import { initializeFirebaseApp } from "./config/firebase.js";
// import signupRoutes from "./routes/signup.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";
// import { notFound } from "./middleware/notFound.js";
// import { errorHandler } from "./middleware/errorHandler.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config({ path: path.join(__dirname, "../.env") });

// const app = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://cdnjs.cloudflare.com",
//           "https://ajax.googleapis.com",
//           "https://code.jquery.com",
//           "https://cdn.jsdelivr.net"
//         ],
//         scriptSrcAttr: ["'unsafe-inline'"],
//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           "https://fonts.googleapis.com",
//           "https://cdnjs.cloudflare.com"
//         ],
//         fontSrc: ["'self'", "https://fonts.gstatic.com","https://cdnjs.cloudflare.com", "data:"],
//         imgSrc: ["'self'", "data:", "https:"],
//         frameSrc: ["'self'", "https://www.youtube.com"], 
//       },
//     },
//   })
// );

// app.use(cors()); 
// app.use(morgan("dev"));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, "../../frontend/public")));

// initializeFirebaseApp();

// app.use("/api/signup", signupRoutes);
// app.use("/api/payment", paymentRoutes);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
// });

// app.use(notFound);

// app.use(errorHandler);

// export default app;

// src/app.js
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import { config } from "./config/config.js";
import signupRoutes from "./routes/signup.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false })); // relaxed for dev
}

// CORS
app.use(cors({
  origin: config.allowedOrigins || "*",
  credentials: true,
}));

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Parsers
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Static Frontend
app.use(express.static(path.join(__dirname, "../../frontend/public"), {
  maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
}));

// ✅ No need to initialize Firebase here anymore
console.log("🔥 Firestore ready. Using collection:", config.firebase.collection);

// API Routes
app.use("/api/v1/signup", signupRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Healthcheck (good for monitoring/devops)
app.get("/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

// Root (frontend index)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;



