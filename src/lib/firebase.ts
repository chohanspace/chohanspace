
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, type Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAe8WM0bi1V8EShjhG7P6oS-YaVukPZgsg",
  authDomain: "chohan-space-portfolio.firebaseapp.com",
  databaseURL: "https://chohan-space-portfolio-default-rtdb.firebaseio.com",
  projectId: "chohan-space-portfolio",
  storageBucket: "chohan-space-portfolio.firebasestorage.app",
  messagingSenderId: "1068084841185",
  appId: "1:1068084841185:web:0c7026d8a342b3e4eb05a0"
};

// This is a global variable that will hold our initialized Firebase services
// We use this "singleton" pattern to avoid re-initializing on every hot-reload in development
// Caching the initialized app in a global variable is the recommended approach.

// We need to declare this on the global type to avoid TypeScript errors
declare global {
  var firebase_app: FirebaseApp | undefined;
  var firebase_db: Database | undefined;
}

let app: FirebaseApp;
let database: Database;

// Initialize Firebase
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Check if we are in a server environment and cache the instance
  if (typeof globalThis !== 'undefined') {
    global.firebase_app = app;
  }
} else {
  app = getApp();
  if (typeof globalThis !== 'undefined' && !global.firebase_app) {
    global.firebase_app = app;
  }
}

// Initialize Realtime Database
try {
    if (typeof globalThis !== 'undefined' && global.firebase_db) {
        database = global.firebase_db;
    } else {
        database = getDatabase(app);
        if (typeof globalThis !== 'undefined') {
            global.firebase_db = database;
        }
    }
} catch (e) {
    console.error("Failed to initialize Firebase Database", e);
    // In case of an error, we explicitly set database to null to avoid undefined behavior.
    // The actions check for this and will return a "Database not configured" error.
    database = null as any; 
}

export { database };
