import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app;
let auth;
let db;

export function initFirebase(config) {
  if (!config) throw new Error('Missing firebase config');
  // protect double initialization
  if (!getApps().length) {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    // reuse
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
}
