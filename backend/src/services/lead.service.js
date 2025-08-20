// src/services/lead.service.js
import { db } from "../config/firebase.js";
import { config } from "../config/config.js";

const collection = config.firebase.collection;

export const LeadService = {
  /** Create new lead (signup) */
  createLead: async (data) => {
    try {
      const docRef = await db.collection(collection).add(data);
      console.log("✅ Lead created with ID:", docRef.id);
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("❌ Error creating lead:", err);
      throw err;
    }
  },

  /** Update payment info by email (fall‑back, assumes unique email) */
  updatePaymentByEmail: async (email, updateData) => {
    try {
      const snap = await db
        .collection(collection)
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snap.empty) {
        console.warn("⚠ No lead found for email:", email);
        return null;
      }

      const docRef = snap.docs[0].ref;
      await docRef.set(updateData, { merge: true });

      console.log("✅ Payment updated for lead email:", email);
      return docRef.id;
    } catch (err) {
      console.error("❌ Error updating payment by email:", err);
      throw err;
    }
  },

  /** Update by Firestore document ID (safer for future) */
  updatePaymentById: async (id, updateData) => {
    try {
      const docRef = db.collection(collection).doc(id);
      await docRef.set(updateData, { merge: true });
      console.log("✅ Payment updated for lead ID:", id);
      return id;
    } catch (err) {
      console.error("❌ Error updating payment by ID:", err);
      throw err;
    }
  },

  /** Get a lead by email */
  getLeadByEmail: async (email) => {
    const snap = await db.collection(collection).where("email", "==", email).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /** Get a lead by Firestore document ID */
  getLeadById: async (id) => {
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
};

