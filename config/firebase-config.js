import admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

admin.initializeApp({
	credential: applicationDefault(),
	databaseURL: process.env.DATABASE_URL,
	projectId: "cooking101-3b0b8"
});

export { admin };
export const db = getFirestore();
