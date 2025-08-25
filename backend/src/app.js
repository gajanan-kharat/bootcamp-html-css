
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
import configRoutes from "./routes/config.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
} else {
  app.use(helmet({ contentSecurityPolicy: false })); 
}

app.use(cors({
  origin: config.allowedOrigins || "*",
  credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../../frontend/public"), {
  maxAge: process.env.NODE_ENV === "production" ? "1d" : 0,
}));

console.log("🔥 Firestore ready. Using collection:", config.firebase.collection);


app.use("/api/v1/signup", signupRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/config", configRoutes);
app.get("/health", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/index.html"));
});

app.use(notFound);
app.use(errorHandler);

export default app;



