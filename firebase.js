const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, collection, addDoc, query, where, getDocs } = require("firebase/firestore");

// const {
//     FIREBASE_API_KEY,
//     FIREBASE_AUTH_DOMAIN,
//     FIREBASE_DATABASE_URL,
//     FIREBASE_PROJECT_ID,
//     FIREBASE_STORAGE_BUCKET,
//     FIREBASE_MESSAGE_SENDER_ID,
//     FIREBASE_APP_ID,
//     FIREBASE_MEASUREMENT_ID
// } = process.env;

// const firebaseConfig = {
//     apiKey: FIREBASE_API_KEY,
//     authDomain: FIREBASE_AUTH_DOMAIN,
//     databaseURL: FIREBASE_DATABASE_URL,
//     projectId: FIREBASE_PROJECT_ID ,
//     storageBucket: FIREBASE_STORAGE_BUCKET,
//     messagingSenderId:  FIREBASE_MESSAGE_SENDER_ID,
//     appId: FIREBASE_APP_ID,
//     measurementId: FIREBASE_MEASUREMENT_ID
  
// };



const firebaseConfig = {
    apiKey: "AIzaSyBnntC0Ojagcz4p-N5EbiPE9t3DoDlGMMo",
    authDomain: "codemind-bootcamp-4bbb2.firebaseapp.com",
    databaseURL: "https://codemind-bootcamp-4bbb2-default-rtdb.firebaseio.com",
    projectId: "codemind-bootcamp-4bbb2",
    storageBucket: "codemind-bootcamp-4bbb2.appspot.com",
    messagingSenderId: "905979696760",
    appId: "1:905979696760:web:3850df9db689d88a10ff8d",
    measurementId: "G-KJQ35VX74W"
  };
  

let app;
let firestoreDb;

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

const uploadProcessedData = async (data) => {
    console.log("uploadProcessedData successfully");
    
    // const dataToUpload = {
    //     name: name,
    //     email: email,
    //     Number: Number
    // };
    // const document = doc(firestoreDb, "user_register", "some-testing-unique-id");
     
     console.log("uploadProcessedData :=> ",data);
     
    try {
       
        const colRef = collection(firestoreDb, "user_register");
        const docRef = await addDoc(colRef, data);

        console.log("Document written with ID:", docRef.id);
        console.log("Data uploaded to Firestore successfully:");
     
    } catch (error) {
        console.error("Error uploading data to Firestore:", error);
    }
};


const updateProcessedData = async (email, name, Number, data) => {
    try {
        const q = query(
            collection(firestoreDb, "user_register"),
            where("email", "==", email),
            where("name", "==", name),
            where("Number", "==", Number)
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
    uploadProcessedData,
    updateProcessedData ,
};
