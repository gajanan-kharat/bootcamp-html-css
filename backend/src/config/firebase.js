// const admin = require("firebase-admin");
// const path = require("path");

// // Load the private key you downloaded from Firebase Console
// const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// let firestoreDb;

// const initializeFirebaseApp = () => {
//   if (!admin.apps.length) {
//     admin.initializeApp({
//       credential: admin.credential.cert(require(serviceAccountPath)),
//     });
//     firestoreDb = admin.firestore();
//     console.log("✅ Firebase Admin initialized successfully");
//   }
// };

// // Upload Data
// const uploadData = async (data) => {
//   try {
//     const docRef = await firestoreDb.collection(process.env.DB_COLLECTION_NAME).add(data);
//     console.log("✅ Document written with ID:", docRef.id);
//   } catch (error) {
//     console.error("❌ Error uploading data to Firestore:", error);
//   }
// };

// // Update Data (payment success etc.)
// const updateData = async (email, name, mobile, data) => {
//   try {
//     const qSnap = await firestoreDb
//       .collection(process.env.DB_COLLECTION_NAME)
//       .where("email", "==", email)
//       .where("name", "==", name)
//       .where("mobile", "==", mobile)
//       .get();

//     if (!qSnap.empty) {
//       const docRef = qSnap.docs[0].ref;
//       await docRef.set(data, { merge: true });
//       console.log("✅ Document updated with ID:", docRef.id);
//     } else {
//       console.log("⚠ No document found for:", email);
//     }
//   } catch (error) {
//     console.error("❌ Error updating document in Firestore:", error);
//   }
// };

// module.exports = {
//   initializeFirebaseApp,
//   uploadData,
//   updateData,
// };

// src/config/firebase.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load serviceAccount JSON securely
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized successfully");
}

// Export Firestore instance directly
export const db = admin.firestore();
