const admin = require("firebase-admin");

// Firebase Admin SDK initialization
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
