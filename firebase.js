const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  setDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} = require("firebase/firestore");

// Load environment variables from .env file
require("dotenv").config();

// Fire base configuration. setting the configuration using .env file
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let app;
let firestoreDb;

// Initializing firebase application
const initializeFirebaseApp = () => {
  try {
    app = initializeApp(firebaseConfig);
    firestoreDb = getFirestore(app);
    console.log("Firebase app initialized successfully");
    return app;
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
};

const uploadData = async (data) => {
  console.log("upload data successfully");
  console.log("upload data :=> ", data);
  try {
    const colRef = collection(firestoreDb, process.env.DB_COLLECTION_NAME);
    const docRef = await addDoc(colRef, data);

    console.log("Document written with ID:", docRef.id);
    console.log("Data uploaded to Firestore successfully:");
  } catch (error) {
    console.error("Error uploading data to Firestore:", error);
  }
};

const updateData = async (email, name, mobile, data) => {
  try {
    const q = query(
      collection(firestoreDb, process.env.DB_COLLECTION_NAME),
      where("email", "==", email),
      where("name", "==", name),
      where("mobile", "==", mobile)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const docRef = doc.ref;

      await setDoc(docRef, data, { merge: true });
      console.log("Document updated with ID:", docRef.id);
    } else {
      console.log("No document found with email:", email);
    }
  } catch (error) {
    console.error("Error updating document in Firestore:", error);
  }
};

const getFirebaseApp = () => app;

module.exports = {
  initializeFirebaseApp,
  getFirebaseApp,
  uploadData,
  updateData,
};
