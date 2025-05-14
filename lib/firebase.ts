import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase configuration with your exact values
export const firebaseConfig = {
  apiKey: "AIzaSyD7PdL-C7QHzNABcEWvmVAHLNiYcr0qpF8",
  authDomain: "gsc-project-2025.firebaseapp.com",
  projectId: "gsc-project-2025",
  storageBucket: "gsc-project-2025.appspot.com", // Corrected to standard format
  messagingSenderId: "260964901002",
  appId: "1:260964901002:web:ed2252fe48268a69278d73",
}

// Initialize Firebase only on the client side
let app, auth, db, storage

if (typeof window !== "undefined") {
  try {
    // Initialize Firebase
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export const debugInfo = {
  apiKeyPresent: !!firebaseConfig.apiKey,
  apiKeyValid:
    typeof firebaseConfig.apiKey === "string" &&
    firebaseConfig.apiKey.length === 40 &&
    firebaseConfig.apiKey.startsWith("AIza"),
  apiKeyLength: firebaseConfig.apiKey?.length || 0,
  apiKeyPrefix: firebaseConfig.apiKey?.substring(0, 4) || "",
  authDomainPresent: !!firebaseConfig.authDomain,
  projectIdPresent: !!firebaseConfig.projectId,
  storageBucketPresent: !!firebaseConfig.storageBucket,
  messagingSenderIdPresent: !!firebaseConfig.messagingSenderId,
  appIdPresent: !!firebaseConfig.appId,
}

export { app, auth, db, storage }
