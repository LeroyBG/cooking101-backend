import admin from "firebase-admin"
import { applicationDefault } from "firebase-admin/app";
import { getFirestore } from 'firebase-admin/firestore'


admin.initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID
});

export const db = getFirestore()