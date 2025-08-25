import { db } from "../config/firebase.js";
import { config } from "../config/config.js";

const collection = config.firebase.collection;

export const LeadService = {
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

  updatePaymentByEmail: async (email, updateData) => {
    try {
      const snap = await db
        .collection(collection)
        .where("student.email", "==", email)
        .limit(1)
        .get();

      if (snap.empty) {
        console.warn("⚠ No lead found for email:", email);
        return null;
      }

      const docRef = snap.docs[0].ref;
      await docRef.set(updateData, { merge: true });

      console.log("✅ Payment updated for lead:", email);
      return docRef.id;
    } catch (err) {
      console.error("❌ Error updating payment:", err);
      throw err;
    }
  },

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

  getLeadByEmail: async (email) => {
    const snap = await db.collection(collection).where("student.email", "==", email).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  getLeadById: async (id) => {
    const doc = await db.collection(collection).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },
};
