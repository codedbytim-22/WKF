// ===== Firebase Configuration - W.K.F Foundation =====
// Replace with your actual Firebase project configuration

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Enable persistence for offline support
db.enablePersistence().catch((err) => {
  if (err.code === "failed-precondition") {
    console.log("Multiple tabs open, persistence disabled");
  } else if (err.code === "unimplemented") {
    console.log("Browser doesn't support persistence");
  }
});

// Export for use in other files
window.wkfDb = db;
window.wkfAuth = auth;
window.wkfStorage = storage;
