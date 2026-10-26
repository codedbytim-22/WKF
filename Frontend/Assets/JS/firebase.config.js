
/*const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "AUTH_DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "STORAGE_BUCKET",
  messagingSenderId: "MESSAGING_SENDER_ID",
  appId: "APP_ID",
};
*/
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
